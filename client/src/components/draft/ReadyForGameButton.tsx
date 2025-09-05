import React from "react";

type ReadyForGameButtonProps = {
    onClick: () => void;
};

const ReadyForGameButton: React.FC<ReadyForGameButtonProps> = ({ onClick }) => (
    <button
        className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]"
        onClick={onClick}
    >
        Ready for Game
    </button>
);

export default ReadyForGameButton;
