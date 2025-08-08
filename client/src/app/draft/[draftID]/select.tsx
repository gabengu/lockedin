"use client"

import io from "socket.io-client"
import { use, useEffect, useState } from "react";


type teamInfo = {
    redDrafter: boolean;
    redDrafterID: string;
    blueDrafter: boolean;
    blueDrafterID: string;
    spectators: number;
}

const socket = io("http://localhost:3001")

export default function Select() {

    //const [redDrafter, setRedDrafter] = useState("");

    const redClicked = () => {
        socket.emit("send_red", {message: "RED PICKED"})
    }
    const blueClicked = () => {
        socket.emit("send_blue", {message: "BLUE PICKED"} )
    }
    const specClicked = () => {
        socket.emit("send_spec", {message: "SPEC CLICKED"})
    }

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            alert(data.message)
        })
    }, [socket])

    return (
        <>
            <button className="bg-red-500" onClick={redClicked}>Red</button>
            <button className="bg-blue-500" onClick={blueClicked}>Blue</button>
            <button className="bg-purple-500" onClick={specClicked}>Spectator</button>
        </>
    )
}