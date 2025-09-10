import React from "react";

type specButtonProps = {
    function: () => void;
};

export default function SpectatorButton(props: specButtonProps) {
    return (
        <>
            <div className="rounded shadow-2xl/50 hover:bg-green-400 text-2xl font-bold bg-green-500 px-20 py-3 cursor-pointer" onClick={props.function}>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col justify-center">
                        Spectator
                    </div>
                </div>
            </div>
        </>
    );
}