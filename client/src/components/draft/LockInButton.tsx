import React from "react";

type LockInButtonProps = {
    onClick: () => void;
};

const LockInButton: React.FC<LockInButtonProps> = ({ onClick }) => (
    <button
        className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]"
        onClick={onClick}
    >
        Lock In
    </button>
);

export default LockInButton;
