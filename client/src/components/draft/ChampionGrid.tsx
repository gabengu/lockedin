import React from "react";
import Icons from "../../app/draft/[draftID]/icons";

type ChampionGridProps = {
    filterChampions: string[];
    activeSide: "blue" | "red";
    handleChampionClick: (name: string, side: "blue" | "red") => void;
};

const ChampionGrid: React.FC<ChampionGridProps> = ({
    filterChampions,
    activeSide,
    handleChampionClick,
}) => (
    <div className=" flex flex-wrap overflow-y-auto w-[800px] h-[calc(100vh-180px)] items-center justify-center hide-scrollbar">
        {filterChampions.map((name, index) => (
            <div
                key={name}
                className="m-1 rounded hover:scale-[105%] transition-all cursor-pointer"
                onClick={() => handleChampionClick(name, activeSide)}
            >
                <Icons
                    key={index}
                    name={name}
                    disable={false}
                    height={75}
                    width={75}
                />
            </div>
        ))}
    </div>
);

export default ChampionGrid;
