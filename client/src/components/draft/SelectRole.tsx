"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import RedBlueButton from "./RedBlueButton";
import SpectatorButton from "./SpectatorButton";
import Navbar from "../navbar";
import { Role } from "@/app/draft/[draftID]/page";

type teamInfo = {
    redDrafter: boolean;
    redDrafterID: string;
    blueDrafter: boolean;
    blueDrafterID: string;
    spectators: number;
};

type selectRoleType = {
    roomId: string;
    onClick: (value: Role) => void;
    socketRef: React.RefObject<Socket | null>;
};

type joinResponse = {
    redDrafter: string;
    blueDrafter: string;
};

export default function Select({ roomId, onClick, socketRef }: selectRoleType) {
    const [redDrafter, setRedDrafter] = useState<boolean>(false);
    const [blueDrafter, setBlueDrafter] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        // first thing a client does when opening page
        console.log(socketRef.current);
        socketRef.current?.emit(
            "join-room",
            {
                message: "ROOM JOINED",
                room: roomId,
                myID: socketRef.current.id,
                // sends a callback function to set the client side drafter info
                // needed for grey buttons
            },
            (response: joinResponse) => {
                setRedDrafter(response.redDrafter === "" ? false : true);
                setBlueDrafter(response.blueDrafter === "" ? false : true);
                setLoading(false);
            },
        );

        // this is the general function for all message recieving from server
        socketRef.current?.on("recieve_message", (data) => {
            // server has allowed this client to take red
            if (data.message == "red take") {
                // render draft page
                onClick(Role.RED);
            } else if (data.message == "blue take") {
                onClick(Role.BLUE);
            }
            // red has already been taken. they get an alert and the button should have been grey anyways
            else if (data.message == "Red already taken") {
                alert("Red Drafter already taken");
            } else if (data.message == "Blue already taken") {
                alert("Blue Drafter already taken");
            } else if (data.message == "i took red") {
                setRedDrafter(true);
            } else if (data.message == "i took blue") {
                setBlueDrafter(true);
            }
        });
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
        onClick(Role.SPECTATOR);
    };

    const handleTakenClick = () => {
        alert("Selected drafter already taken");
    };

    return (
        // has conditional rendering to grey out buttons if drafter already taken
        <div className="flex flex-col min-h-screen items-center justify-center bg-radial from-green-300 from-1% to-black to-25%">
            <Navbar />
            <div className="flex flex-col items-center w-115 h-80 rounded-2xl border border-green-300 bg-opacity-80 bg-gradientcolor shadow-[0_0_80px_30px_rgba(74,222,128,0.5)]">
                {!loading && (
                    <>
                        <div className="flex flex-row w-full h-8">
                            <div className="flex flex-col justify-start ml-3 mt-3 w-8 h-6 bg-backbutton rounded-sm cursor-pointer hover:bg-green-500">
                                <div className="flex flex-row justify-center">
                                    ←
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-5xl text-sidetext font-[Sprintura Demo] mb-7">
                            Choose a side
                        </div>
                        <div className="flex flex-row justify-center">
                            <div className="flex flex-col items-center m-3">
                                {blueDrafter && (
                                    <RedBlueButton
                                        text="Blue"
                                        colour="bg-slate-700 "
                                        hover=" "
                                        cursor="cursor-default "
                                        function={handleTakenClick}
                                    />
                                )}
                                {!blueDrafter && (
                                    <RedBlueButton
                                        text="Blue"
                                        colour="bg-bluebutton "
                                        hover="hover:bg-blue-400 "
                                        cursor="cursor-pointer "
                                        function={handleBlueClick}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col items-center m-3">
                                {redDrafter && (
                                    <RedBlueButton
                                        text="Red"
                                        colour="bg-slate-700 "
                                        hover=" "
                                        cursor="cursor-default "
                                        function={handleTakenClick}
                                    />
                                )}
                                {!redDrafter && (
                                    <RedBlueButton
                                        text="Red"
                                        colour="bg-redbutton "
                                        hover="hover:bg-red-400 "
                                        cursor="cursor-pointer "
                                        function={handleRedClick}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row justify-center m-3">
                            <SpectatorButton function={handleSpecClick} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
