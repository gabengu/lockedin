import type { Socket } from "socket.io";

const io = require("socket.io")(3001, {
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

io.on("connection", (socket: Socket) => {

    // recieves a callback function from the client
    // basically client waits for a response and then re-renders the page once it recieves drafter info
    socket.on("join-room", (data, callback) => {
        socket.join(data.room);
        // add room info to list of rooms if it does not exist
        if (!roomInfo[data.room]) {
            roomInfo.push(data.room);
        }
        // client waits for this info
        callback({
            redDrafter: roomRedDrafters[data.room] ? roomRedDrafters[data.room] : "",
            blueDrafter: roomBlueDrafters[data.room] ? roomBlueDrafters[data.room] : ""
        });
    });

    // recieves "send red" from client
    socket.on("send_red", (data) => {
        // checks if theres a red drafter 
        if (roomRedDrafters[data.room] == undefined) {
            // if not set requesting client as red drafter
            roomRedDrafters[data.room] = data.myID;
            io.to(data.myID).emit("recieve_message", {message: "red take"});
            // tell the rest red was taken
            socket.to(data.room).emit("recieve_message", {message: "i took red"});
        }
        else {
            // else notify the user they cannot take red
            io.to(data.myID).emit("recieve_message", {message: "Red already taken"});
        }
    });
    // same as red
    socket.on("send_blue", (data) => {
        if (roomBlueDrafters[data.room] == undefined) {
            roomBlueDrafters[data.room] = data.myID;
            io.to(data.myID).emit("recieve_message", {message: "blue take"});
            // tell the rest blue was taken
            socket.to(data.room).emit("recieve_message", {message: "i took blue"});
        }
        else {
            io.to(data.myID).emit("recieve_message", {message: "Blue already taken"});
        }
    });
    // no special cases for spectator yet
    socket.on("send_spec", (data) => {
        io.to(data.myID).emit("recieve_message", data);
    });
}); 
