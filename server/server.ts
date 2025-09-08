import type { Socket } from "socket.io";

const io = require("socket.io")(3001, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});


const roomRedDrafters: { [key: string]: string } = {};
const roomBlueDrafters: { [key: string]: string } = {};
const roomInfo: string[] = [];

io.on("connection", (socket: Socket) => {

    //console.log(socket.id);

    socket.on("join-room", (data) => {
        socket.join(data.room);
        if (!roomInfo[data.room]) {
            roomInfo.push(data.room);
        }
        //console.log(roomRedDrafters[data.room]);

        //console.log(data.message + data.room);
    });
    socket.on("send_red", (data) => {
        if (roomRedDrafters[data.room] == undefined) {
            roomRedDrafters[data.room] = data.myID;
            io.to(data.myID).emit("recieve_message", {message: "red take"});
            console.log(roomRedDrafters[data.room]);
        }
        else {
            io.to(data.myID).emit("recieve_message", {message: "Red already taken"});
        }
    });
    socket.on("send_blue", (data) => {
        if (roomBlueDrafters[data.room] == undefined) {
            roomBlueDrafters[data.room] = data.myID;
            io.to(data.myID).emit("recieve_message", {message: "blue take"});
            console.log(roomBlueDrafters[data.room]);
        }
        else {
            io.to(data.myID).emit("recieve_message", {message: "Blue already taken"});
        }
    });
    socket.on("send_spec", (data) => {
        socket.to(data.room).emit("recieve_message", data);
    });
}); 
