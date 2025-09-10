"use client";

import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import RedBlueButton from "./RedBlueButton";
import SpectatorButton from "./SpectatorButton";
import Navbar from "../navbar";

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

type drafters = {
    redDrafter: string;
    blueDrafter: string;
}


export default function Select({ roomId, onClick }: selectRoleType) {
    const [redDrafter, setRedDrafter] = useState<boolean>(false);
    const [blueDrafter, setBlueDrafter] = useState<boolean>(false);
    const socketRef = useRef<Socket>(null);
    useEffect(() => {
        socketRef.current = io("http://localhost:3001");

        // first thing a client does when opening page
        socketRef.current.emit("join-room", {
            message: "ROOM JOINED",
            room: roomId,
            myID: socketRef.current.id,
            // sends a callback function to set the client side drafter info
            // needed for grey buttons
        }, (response:drafters) => {
            setRedDrafter(response.redDrafter === "" ? false : true);
            setBlueDrafter(response.blueDrafter === "" ? false : true);
        });

        // this is the general function for all message recieving from server
        socketRef.current.on("recieve_message", (data) => {

            // server has allowed this client to take red
            if (data.message == "red take") {
                // render draft page
                onClick();
            }
            else if (data.message == "blue take") {
                onClick();
            }
            // red has already been taken. they get an alert and the button should have been grey anyways
            else if (data.message == "Red already taken") {
                alert("Red Drafter already taken");
            }
            else if (data.message == "Blue already taken") {
                alert("Blue Drafter already taken");
            }
            else if (data.message == "i took red") {
                setRedDrafter(true);
            }
            else if (data.message == "i took blue") {
                setBlueDrafter(true);
            }
        });
        return () => {
            socketRef.current?.off("recieve_message");
            socketRef.current?.disconnect();
        };
    }, [roomId, redDrafter, blueDrafter]);

    // red was clicked
    const handleRedClick = () => {
        socketRef.current?.emit("send_red", {
            message: "RED PICKED",
            room: roomId,
            myID: socketRef.current.id,
        });
    };
    const handleBlueClick = () => {
        socketRef.current?.emit("send_blue", {
            message: "BLUE PICKED",
            room: roomId,
            myID: socketRef.current.id,
        });
    };
    const handleSpecClick = () => {
        socketRef.current?.emit("send_spec", {
            message: "SPEC CLICKED",
            room: roomId,
        });
        onClick();
    };

    return (
        // has conditional rendering to grey out buttons if drafter already taken
        <div className="flex flex-col min-h-screen items-center justify-center bg-black">
            <div className="">
                <Navbar />
            </div>
            <div className="flex flex-col items-center bg-slate-800 px-10 py-10">
                <div className="flex flex-col items-center text-5xl text-white font-[Sprintura Demo] mb-10">
                        Choose a side
                </div>
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col items-center m-3">
                        {redDrafter && (
                            <RedBlueButton text="Red " colour="bg-slate-500 " function={handleRedClick} />
                            )}
                        {!redDrafter && (
                            <RedBlueButton text="Red " colour="bg-red-500 " function={handleRedClick} />
                        )}
                    </div>
                    <div className="flex flex-col items-center m-3">
                        {blueDrafter && (
                            <RedBlueButton text="Blue " colour="bg-slate-500 " function={handleBlueClick} />
                        )}
                        {!blueDrafter && (
                            <RedBlueButton text="Blue " colour="bg-blue-500 " function={handleBlueClick} />
                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-center m-3">
                    <SpectatorButton function={handleSpecClick} />
                </div>
            </div>
        </div>
    );

}
