import React from "react";

type redBlueButtonProps = {
    function: () => void;
    colour: string;
    text: string;
    hover: string;
    cursor: string;
};

export default function RedBlueButton(props: redBlueButtonProps) {
    return (
        <>
            <div className={props.colour + props.hover + props.cursor + "rounded shadow-2xl/50 text-4xl font-bold w-30 h-16"} onClick={props.function}>
                <div className="flex flex-col justify-center h-full">
                    <div className="flex flex-row justify-center">
                        {props.text}
                    </div>
                </div>
            </div>
        </>
    );
}