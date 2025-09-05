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

type selectRoleType = {
    roomId: string;
    onClick: () => void;
};

export default function Select({ roomId, onClick }: selectRoleType) {
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

    const handleRedClick = () => {
        socketRef.current?.emit("send_red", {
            message: "RED PICKED",
            room: roomId,
        });
        onClick();
    };
    const handleblueClick = () => {
        socketRef.current?.emit("send_blue", {
            message: "BLUE PICKED",
            room: roomId,
        });
        onClick();
    };
    const handleSpecClick = () => {
        socketRef.current?.emit("send_spec", {
            message: "SPEC CLICKED",
            room: roomId,
        });
        onClick();
    };

    return (
        <>
            <button className="bg-red-500" onClick={handleRedClick}>
                Red
            </button>
            <button className="bg-blue-500" onClick={handleblueClick}>
                Blue
            </button>
            <button className="bg-purple-500" onClick={handleSpecClick}>
                Spectator
            </button>
        </>
    );
}
