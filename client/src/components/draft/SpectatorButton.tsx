import React from "react";

type specButtonProps = {
    function: () => void;
};

export default function SpectatorButton(props: specButtonProps) {
    return (
        <>
            <button className="text-2xl bg-green-500 px-20 py-3" onClick={props.function}>
                Spectator
            </button>
        </>
    );
}