import React from "react";

type redBlueButtonProps = {
    function: () => void;
    colour: string;
    text: string;
};

export default function RedBlueButton(props: redBlueButtonProps) {
    return (
        <>
            <button className={props.colour + "text-2xl py-10 px-20"}onClick={props.function}>
                {props.text}
            </button>
        </>
    );
}