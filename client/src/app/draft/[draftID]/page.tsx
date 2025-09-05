"use client";
import { use, useEffect, useState } from "react";
import TeamHeader from "@/components/draft/TeamHeader";
import BlueTeamPanel from "@/components/draft/BlueTeamPanel";
import RedTeamPanel from "@/components/draft/RedTeamPanel";
import ChampionGrid from "@/components/draft/ChampionGrid";
import LockInButton from "@/components/draft/LockInButton";
import ReadyForGameButton from "@/components/draft/ReadyForGameButton";
import SelectRole from "@/components/draft/SelectRole";
import Icons from "./icons.tsx";
import SplashArt from "./splashArt.tsx";
import { draftOrder, DraftChamps } from "./draftOrder.tsx";
import { notFound, useRouter } from "next/navigation";
import { getDraft } from "../roomStore.ts";
import { set } from "better-auth";

type DraftData = {
    team1: string;
    team2: string;
    draftType: string;
};

type PageProps = {
    draftID: string;
};

export default function DraftRoom({
    params,
}: {
    params: Promise<{ draftID: string }>;
}) {
    const router = useRouter();
    const [draftData, setDraftData] = useState<DraftData>();

    const [roomId, setRoomId] = useState<string>("");
    const [hasRole, setHasRole] = useState<boolean>(false);

    const [allChampions, setAllChampions] = useState<string[]>([]);
    const [filterChampions, setFilterChampions] = useState<string[]>([]);
    const [activeSide, setActiveSide] = useState<"blue" | "red">("blue");

    const [draftState, setDraftState] = useState<DraftChamps>({
        globalBans: [],
        blueTeamBans: new Array(5).fill(null),
        redTeamBans: new Array(5).fill(null),
        blueTeamPicks: new Array(5).fill(null),
        redTeamPicks: new Array(5).fill(null),
        draftStep: 20,
        draftCompletion: true,
        selectedPick: null,
    });

    useEffect(() => {
        async function getData() {
            const draftID = (await params).draftID;
            const draft = getDraft(draftID);
            const draftInfo = await draft;
            if (draftInfo === undefined) {
                router.push("/notfound");
            }
            setDraftData(draftInfo);
            setRoomId(draftID);
        }
        async function getAllChampions() {
            const response = await fetch(
                "https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json",
            );
            if (!response.ok) {
                throw new Error("Failed to fetch champions");
            }
            const data = await response.json();
            setAllChampions(Object.keys(data.data));
            setFilterChampions(Object.keys(data.data));
        }
        getAllChampions();
        getData();
    }, []);

    const renderIcons = () => {
        // Deprecated: replaced by ChampionGrid
        return null;
    };

    function addChampion(
        array: (string | null)[],
        champion: string | null,
    ): (string | null)[] {
        const next = [...array];
        const index = next.findIndex((e) => e === null);
        if (index !== -1) {
            next[index] = champion;
        }
        return next;
    }

    function setNull(array: (string | null)[]): (string | null)[] {
        for (let i = 0; i < array.length; i++) {
            array[i] = null;
        }
        return array;
    }

    const handleChampionClick = (champion: string, team: "blue" | "red") => {
        // For websocket implementation use
        // if (team == draftOrder[draftState.currentStep].side)
        if (draftState.draftCompletion == false) {
            const invalidPick: boolean =
                draftState.globalBans.includes(champion) ||
                draftState.blueTeamBans.includes(champion) ||
                draftState.redTeamBans.includes(champion) ||
                draftState.blueTeamPicks.includes(champion) ||
                draftState.redTeamPicks.includes(champion);

            if (invalidPick) {
                throw new Error("Champion is banned or already picked!");
            } else {
                setDraftState((prev) => ({
                    ...prev,
                    selectedPick: champion,
                }));
            }
        }
    };

    const handleLockIn = () => {
        const step = draftOrder[draftState.draftStep];

        if (draftState.selectedPick)
            if (step.action == "ban") {
                if (step.side == "blue") {
                    setDraftState((prev) => ({
                        ...prev,
                        blueTeamBans: addChampion(
                            prev.blueTeamBans,
                            draftState.selectedPick,
                        ),
                    }));
                }
                if (step.side == "red") {
                    setDraftState((prev) => ({
                        ...prev,
                        redTeamBans: addChampion(
                            prev.redTeamBans,
                            draftState.selectedPick,
                        ),
                    }));
                }
            } else if (step.action == "pick") {
                if (step.side == "blue") {
                    setDraftState((prev) => ({
                        ...prev,
                        blueTeamPicks: addChampion(
                            prev.blueTeamPicks,
                            draftState.selectedPick,
                        ),
                    }));
                }
                if (step.side == "red") {
                    setDraftState((prev) => ({
                        ...prev,
                        redTeamPicks: addChampion(
                            prev.redTeamPicks,
                            draftState.selectedPick,
                        ),
                    }));
                }
            }
        setDraftState((prev) => ({
            ...prev,
            draftStep: prev.draftStep + 1,
            selectedPick: null,
        }));
        setActiveSide(step.side);

        if (draftState.draftStep == 19) {
            setDraftState((prev) => ({
                ...prev,
                draftCompletion: true,
            }));
        }
    };

    //Currently doubles as draft initiation.
    const restartDraft = () => {
        if (draftData?.draftType == "fearless" || "ironman") {
            setDraftState((prev) => ({
                ...prev,
                globalBans: [
                    ...prev.globalBans,
                    ...draftState.blueTeamPicks,
                    ...draftState.redTeamPicks,
                ],
            }));
            if (draftData?.draftType == "ironman") {
                setDraftState((prev) => ({
                    ...prev,
                    globalBans: [
                        ...prev.globalBans,
                        ...draftState.blueTeamBans,
                        ...draftState.redTeamBans,
                    ],
                }));
            }
        }
        setDraftState((prev) => ({
            ...prev,
            blueTeamBans: setNull(prev.blueTeamBans),
            redTeamBans: setNull(prev.redTeamBans),
            blueTeamPicks: setNull(prev.blueTeamPicks),
            redTeamPicks: setNull(prev.redTeamPicks),
            draftStep: 0,
            draftCompletion: false,
        }));
    };

    return (
        <>
            {!hasRole && (
                <SelectRole roomId={roomId} onClick={() => setHasRole(true)} />
            )}
            {draftData && hasRole && (
                <div className="flex flex-col bg-black min-h-screen">
                    <TeamHeader
                        team1={draftData.team1}
                        team2={draftData.team2}
                    />
                    <div className="flex flex-row justify-between">
                        <BlueTeamPanel draftState={draftState} />
                        <div className="flex flex-col items-center">
                            <div className=" flex flex-row justify-between w-[731px]">
                                <div className=" flex flex-row w-[250px] justify-between items-center">
                                    <div className="bg-[#40865d] w-[40px] h-[40px]"></div>
                                    <div className="bg-[#40865d] w-[40px] h-[40px]"></div>
                                    <div className="bg-[#40865d] w-[40px] h-[40px]"></div>
                                    <div className="bg-[#40865d] w-[40px] h-[40px]"></div>
                                    <div className="bg-[#40865d] w-[40px] h-[40px]"></div>
                                </div>
                                <div className="inline-block border-2 border-[#40865d]">
                                    <input
                                        className=""
                                        type="text"
                                        id="myTextInput"
                                        name="myTextInput"
                                    />
                                </div>
                            </div>
                            <ChampionGrid
                                filterChampions={filterChampions}
                                activeSide={activeSide}
                                handleChampionClick={handleChampionClick}
                            />
                        </div>
                        <RedTeamPanel draftState={draftState} />
                    </div>
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                        {draftState.selectedPick && (
                            <LockInButton onClick={handleLockIn} />
                        )}
                        {draftState.draftCompletion && (
                            <ReadyForGameButton onClick={restartDraft} />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
