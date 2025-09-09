import React from "react";

type redBlueButtonProps = {
    colourCode: "bg-red-500" | "bg-blue-500" | "bg-purple-500" | "bg-slate-500";
    side: "Red" | "Blue" | "Spectator";
    function: () => void;
};

export default function RedBlueButton(props: redBlueButtonProps) {
    return (
        <>
            <button className={props.colourCode} onClick={props.function}>
                {props.side}
            </button>
        </>
    );
}