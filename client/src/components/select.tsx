"use client";

import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

type teamInfo = {
    redDrafter: boolean;
    redDrafterID: string;
    blueDrafter: boolean;
    blueDrafterID: string;
    spectators: number;
};

type room = {
    roomId: string;
};

export default function Select({ roomId }: room) {
    //const [redDrafter, setRedDrafter] = useState("");
    const socketRef = useRef<Socket>(null);
    useEffect(() => {
        socketRef.current = io("http://localhost:3001");
        socketRef.current.emit("join-room", {
            message: "ROOM JOINED",
            room: roomId,
        });
        socketRef.current.on("recieve_message", (data) => {
            alert(data.message);
        });
        return () => {
            socketRef.current?.off("recieve_message");
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    const redClicked = () => {
        socketRef.current?.emit("send_red", {
            message: "RED PICKED",
            room: roomId,
        });
    };
    const blueClicked = () => {
        socketRef.current?.emit("send_blue", {
            message: "BLUE PICKED",
            room: roomId,
        });
    };
    const specClicked = () => {
        socketRef.current?.emit("send_spec", {
            message: "SPEC CLICKED",
            room: roomId,
        });
    };

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
