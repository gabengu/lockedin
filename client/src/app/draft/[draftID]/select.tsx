"use client";

import io from "socket.io-client";
import { use, useEffect, useState } from "react";
import { set } from "better-auth";
import { Socket } from "socket.io-client";

type teamInfo = {
    redDrafter: boolean;
    redDrafterID: string;
    blueDrafter: boolean;
    blueDrafterID: string;
    spectators: number;
};

export default function Select() {
    //const [redDrafter, setRedDrafter] = useState("");
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        setSocket(io("http://localhost:3001"));
    }, []);

    const redClicked = () => {
        socket?.emit("send_red", { message: "RED PICKED" });
        console.log("hello");
    };
    const blueClicked = () => {
        socket?.emit("send_blue", { message: "BLUE PICKED" });
        console.log("hi");
    };
    const specClicked = () => {
        socket?.emit("send_spec", { message: "SPEC CLICKED" });
    };

    socket?.on("recieve_message", (data) => {
        alert(data.message);
    });

    return (
        <>
            <button className="bg-red-500" onClick={redClicked}>
                Red
            </button>
            <button className="bg-blue-500" onClick={blueClicked}>
                Blue
            </button>
            <button className="bg-purple-500" onClick={specClicked}>
                Spectator
            </button>
        </>
    );
}
