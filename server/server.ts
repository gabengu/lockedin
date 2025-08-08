import type { Socket } from "socket.io";

const io = require("socket.io")(3001, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log(socket.id);

    socket.on("send_red", (data) => {
        socket.broadcast.emit("recieve_message", data);
    });
    socket.on("send_blue", (data) => {
        socket.broadcast.emit("recieve_message", data);
    });
    socket.on("send_spec", (data) => {
        socket.broadcast.emit("recieve_message", data);
    });
});
