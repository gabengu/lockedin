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
    const [redDrafter, setRedDrafter] = useState<string>("");
    const [blueDrafter, setBlueDrafter] = useState<string>("");
    const socketRef = useRef<Socket>(null);
    useEffect(() => {
        socketRef.current = io("http://localhost:3001");
        socketRef.current.emit("join-room", {
            message: "ROOM JOINED",
            room: roomId,
            myID: socketRef.current.id,
        });
        socketRef.current.on("recieve_message", (data) => {
            if (data.message == "Room Joined") {
            }
            else if (data.message == "red take") {
                onClick();
            }
            else if (data.message == "blue take") {
                onClick();
            }
            else if (data.message == "Red already taken") {
                alert("Red Drafter already taken");
            }
            else if (data.message == "Blue already taken") {
                alert("Blue Drafter already taken");
            }
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
            myID: socketRef.current.id,
        });
        //onClick();
    };
    const handleblueClick = () => {
        socketRef.current?.emit("send_blue", {
            message: "BLUE PICKED",
            room: roomId,
            myID: socketRef.current.id,
        });
        //onClick();
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
            <button className="bg-red-500 disabled:bg-slate-500" onClick={handleRedClick} disabled={redDrafter != ""}>
                Red
            </button>
            <button className="bg-blue-500 disabled:bg-slate-500" onClick={handleblueClick} disabled={blueDrafter != ""}>
                Blue
            </button>
            <button className="bg-purple-500" onClick={handleSpecClick}>
                Spectator
            </button>
        </>
    );
}
