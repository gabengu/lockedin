import React from "react";
import SplashArt from "../../app/draft/[draftID]/splashArt";
import Icons from "../../app/draft/[draftID]/icons";

type RedTeamPanelProps = {
    draftState: any;
};

const RedTeamPanel: React.FC<RedTeamPanelProps> = ({ draftState }) => (
    <div className=" flex flex-col w-[300px]">
        {/* Picks */}
        {[0, 1, 2, 3, 4].map((i) => (
            <div
                key={i}
                className=" border-t-2 border-l-2 border-gray-600 flex-1 "
            >
                {draftState.draftStep === [7, 8, 11, 16, 19][i] &&
                draftState.selectedPick ? (
                    <SplashArt name={draftState.selectedPick} />
                ) : draftState.redTeamPicks[i] ? (
                    <SplashArt name={draftState.redTeamPicks[i]} />
                ) : null}
            </div>
        ))}
        {/* Bans */}
        <div className="flex flex-row">
            {[4, 3, 2, 1, 0].map((i, idx) => (
                <div
                    key={i}
                    className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"
                >
                    {draftState.draftStep === [14, 12, 5, 3, 1][idx] &&
                    draftState.selectedPick ? (
                        <Icons
                            name={draftState.selectedPick}
                            height={55}
                            width={55}
                            disable={false}
                        />
                    ) : draftState.redTeamBans[i] ? (
                        <Icons
                            name={draftState.redTeamBans[i]}
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

export default RedTeamPanel;
