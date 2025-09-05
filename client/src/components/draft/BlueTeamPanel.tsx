import React from "react";
import SplashArt from "../../app/draft/[draftID]/splashArt";
import Icons from "../../app/draft/[draftID]/icons";

type BlueTeamPanelProps = {
    draftState: any;
};

const BlueTeamPanel: React.FC<BlueTeamPanelProps> = ({ draftState }) => (
    <div className=" flex flex-col w-[300px]">
        {/* Picks */}
        {[0, 1, 2, 3, 4].map((i) => (
            <div
                key={i}
                className=" border-t-2 border-r-2 border-gray-600 flex-1 "
            >
                {draftState.draftStep === [6, 9, 10, 17, 18][i] &&
                draftState.selectedPick ? (
                    <SplashArt name={draftState.selectedPick} />
                ) : draftState.blueTeamPicks[i] ? (
                    <SplashArt name={draftState.blueTeamPicks[i]} />
                ) : null}
            </div>
        ))}
        {/* Bans */}
        <div className="flex flex-row">
            {[0, 1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"
                >
                    {draftState.draftStep === [0, 2, 4, 13, 15][i] &&
                    draftState.selectedPick ? (
                        <Icons
                            name={draftState.selectedPick}
                            height={55}
                            width={55}
                            disable={false}
                        />
                    ) : draftState.blueTeamBans[i] ? (
                        <Icons
                            name={draftState.blueTeamBans[i]}
                            height={55}
                            width={55}
                            disable={false}
                        />
                    ) : null}
                </div>
            ))}
        </div>
    </div>
);

export default BlueTeamPanel;
