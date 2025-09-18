import React from "react";

type specButtonProps = {
    function: () => void;
};

export default function SpectatorButton(props: specButtonProps) {
    return (
        <>
            <div className="rounded-lg shadow-2xl/50 hover:bg-green-400 text-2xl font-bold bg-specbutton w-45 h-12 cursor-pointer opacity-100" onClick={props.function}>
                <div className="flex flex-col justify-center h-full">
                    <div className="flex flex-row justify-center">
                        Spectator
                    </div>
                </div>
            </div>
        </>
    );
}