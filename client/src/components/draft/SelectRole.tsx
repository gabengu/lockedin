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

    const handleTakenClick = () => {
        alert("Selected drafter already taken");
    }

    return (
        // has conditional rendering to grey out buttons if drafter already taken
        <div className="flex flex-col min-h-screen items-center justify-center bg-radial from-green-300 from-1% to-black to-25%">
            <Navbar />
            <div className="flex flex-col items-center w-115 h-80 rounded-2xl border border-green-300 bg-opacity-80 bg-gradientcolor shadow-[0_0_80px_30px_rgba(74,222,128,0.5)]">
                <div className="flex flex-row w-full h-8">
                    <div className="flex flex-col justify-start ml-3 mt-3 w-8 h-6 bg-backbutton rounded-sm cursor-pointer hover:bg-green-500">
                        <div className="flex flex-row justify-center">←</div>
                    </div>
                </div>
                <div className="flex flex-col items-center text-5xl text-sidetext font-[Sprintura Demo] mb-7">
                        Choose a side
                </div>
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col items-center m-3">
                        {blueDrafter && (
                            <RedBlueButton text="Blue" colour="bg-slate-700 " hover=" " cursor="cursor-default " function={handleTakenClick} />
                        )}
                        {!blueDrafter && (
                            <RedBlueButton text="Blue" colour="bg-bluebutton " hover="hover:bg-blue-400 " cursor="cursor-pointer " function={handleBlueClick} />
                        )}
                    </div>
                    <div className="flex flex-col items-center m-3">
                        {redDrafter && (
                            <RedBlueButton text="Red" colour="bg-slate-700 " hover=" " cursor="cursor-default " function={handleTakenClick} />
                            )}
                        {!redDrafter && (
                            <RedBlueButton text="Red" colour="bg-redbutton " hover="hover:bg-red-400 " cursor="cursor-pointer " function={handleRedClick} />
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
