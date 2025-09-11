import React from "react";
import Icons from "../../app/draft/[draftID]/icons";
import { DraftChamps } from "../../app/draft/[draftID]/draftOrder";

type ChampionGridProps = {
    filterChampions: string[];
    activeSide: "blue" | "red";
    handleChampionClick: (name: string, side: "blue" | "red") => void;
    draftState: DraftChamps;
};

const ChampionGrid: React.FC<ChampionGridProps> = ({
    filterChampions,
    activeSide,
    handleChampionClick,
    draftState,
}) => {
    const isChampionDisabled = (name: string): boolean => {
        return (
            draftState.globalBans.includes(name) ||
            draftState.blueTeamBans.includes(name) ||
            draftState.redTeamBans.includes(name) ||
            draftState.blueTeamPicks.includes(name) ||
            draftState.redTeamPicks.includes(name)
        );
    };

    return (
        <div className="flex flex-wrap overflow-y-auto w-[800px] h-[calc(100vh-180px)] items-center justify-center hide-scrollbar">
            {filterChampions.map((name, index) => {
                const isDisabled = isChampionDisabled(name);
                return (
                    <div
                        key={name}
                        className={`m-1 rounded transition-all ${
                            isDisabled
                                ? "cursor-not-allowed opacity-35"
                                : "hover:scale-[105%] cursor-pointer"
                        }`}
                        onClick={() =>
                            !isDisabled && handleChampionClick(name, activeSide)
                        }
                    >
                        <Icons
                            key={index}
                            name={name}
                            disable={isDisabled}
                            height={75}
                            width={75}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ChampionGrid;
