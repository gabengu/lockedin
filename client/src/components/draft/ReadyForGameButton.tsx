import { FC } from "react";

type ReadyForGameButtonProps = {
    onClick: () => void;
    blueReady: boolean;
    redReady: boolean;
    role: "blue" | "red" | "spectator";
};

const ReadyForGameButton: FC<ReadyForGameButtonProps> = ({
    onClick,
    blueReady,
    redReady,
    role,
}) => {
    const userReady = role === "blue" ? blueReady : redReady;
    const buttonText = () => {
        if (role === "spectator") {
            return "Waiting for teams...";
        } else if (userReady) {
            return "Waiting for opponent...";
        } else {
            return "Ready for Game";
        }
    };

    return (
        <button
            className="bg-[#4dab74] text-black text-[20px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]"
            onClick={() => role !== "spectator" && onClick()}
            disabled={role === "spectator"}
        >
            {buttonText()}
        </button>
    );
};

export default ReadyForGameButton;
