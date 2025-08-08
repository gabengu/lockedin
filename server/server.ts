import type { Socket } from "socket.io";

const io = require("socket.io")(3001, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log(socket.id);

    socket.on("join-room", (data) => {
        socket.join(data.room);
        console.log(data.message + data.room);
    });
    socket.on("send_red", (data) => {
        socket.to(data.room).emit("recieve_message", data);
    });
    socket.on("send_blue", (data) => {
        socket.to(data.room).emit("recieve_message", data);
    });
    socket.on("send_spec", (data) => {
        socket.to(data.room).emit("recieve_message", data);
    });
});
