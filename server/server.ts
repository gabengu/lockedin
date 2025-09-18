import type { Socket } from "socket.io";
import type { DraftChamps } from "./types/types"; // <-- import shared type
import { Server } from "socket.io";
import { DraftManager } from "./draftManager";

const io = new Server(3001, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

// key = room
// returns drafter's socket id
const roomRedDrafters: { [key: string]: string } = {};
const roomBlueDrafters: { [key: string]: string } = {};

// stores list of all open rooms
const roomInfo: string[] = [];

const draftManager = new DraftManager();

io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-room", (data, callback) => {
        const { room } = data;
        socket.join(room);

        // Add room to room list if it doesn't exist
        if (!roomInfo.includes(room)) {
            roomInfo.push(room);
        }

        // Ensure this room has a draft state initialized
        const currentDraft = draftManager.getDraft(room);

        // Send drafter info to client
        callback({
            redDrafter: roomRedDrafters[room] ?? "",
            blueDrafter: roomBlueDrafters[room] ?? "",
        });

        // Send state to this socket
        socket.emit("draftState", currentDraft);
    });

    socket.on("send_red", (data) => {
        const { room, myID } = data;
        if (!roomRedDrafters[room]) {
            roomRedDrafters[room] = myID;
            io.to(myID).emit("recieve_message", { message: "red take" });
            socket.to(room).emit("recieve_message", { message: "i took red" });
        } else {
            io.to(myID).emit("recieve_message", {
                message: "Red already taken",
            });
        }
    });

    socket.on("send_blue", (data) => {
        const { room, myID } = data;
        if (!roomBlueDrafters[room]) {
            roomBlueDrafters[room] = myID;
            io.to(myID).emit("recieve_message", { message: "blue take" });
            socket.to(room).emit("recieve_message", { message: "i took blue" });
        } else {
            io.to(myID).emit("recieve_message", {
                message: "Blue already taken",
            });
        }
    });

    socket.on("send_spec", (data) => {
        io.to(data.myID).emit("recieve_message", data);
    });

    socket.on("updateDraft", (room: string, newState: DraftChamps) => {
        const updated = draftManager.updateDraft(room, newState);
        io.to(room).emit("draftState", updated);
    });

    socket.on("getDraftState", (room: string) => {
        const current = draftManager.getDraft(room);
        socket.emit("draftState", current);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
