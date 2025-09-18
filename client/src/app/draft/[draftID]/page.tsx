"use client";
import { act, use, useEffect, useRef, useState } from "react";
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
import io, { Socket } from "socket.io-client";

type DraftData = {
    team1: string;
    team2: string;
    draftType: string;
};

type PageProps = {
    draftID: string;
};

export enum Role {
    RED = "red",
    BLUE = "blue",
    SPECTATOR = "spectator",
}

export default function DraftRoom({
    params,
}: {
    params: Promise<{ draftID: string }>;
}) {
    const router = useRouter();
    const [draftData, setDraftData] = useState<DraftData>();

    const [roomId, setRoomId] = useState<string>("");
    const [role, setRole] = useState<Role | null>(null);

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
    const socketRef = useRef<Socket | null>(null);
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

        socketRef.current = io("http://localhost:3001");
        socketRef.current?.on("draftState", (data: DraftChamps) => {
            setDraftState(data);
            if (!data.draftCompletion) {
                setActiveSide(draftOrder[data.draftStep].side);
            }
            console.log(data);
        });
        return () => {
            socketRef.current?.off("recieve_message");
            socketRef.current?.disconnect();
        };
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
        if (team == role && draftState.draftCompletion == false) {
            {
                setDraftState((prev) => ({
                    ...prev,
                    selectedPick: champion,
                }));
                socketRef.current?.emit("updateDraft", roomId, {
                    ...draftState,
                    selectedPick: champion,
                });
            }
        }
    };
    const handleLockIn = () => {
        setDraftState((prev) => {
            const step = draftOrder[prev.draftStep];
            const newState = { ...prev };

            if (prev.selectedPick) {
                if (step.action === "ban") {
                    if (step.side === "blue") {
                        newState.blueTeamBans = addChampion(
                            prev.blueTeamBans,
                            prev.selectedPick,
                        );
                    } else if (step.side === "red") {
                        newState.redTeamBans = addChampion(
                            prev.redTeamBans,
                            prev.selectedPick,
                        );
                    }
                } else if (step.action === "pick") {
                    if (step.side === "blue") {
                        newState.blueTeamPicks = addChampion(
                            prev.blueTeamPicks,
                            prev.selectedPick,
                        );
                    } else if (step.side === "red") {
                        newState.redTeamPicks = addChampion(
                            prev.redTeamPicks,
                            prev.selectedPick,
                        );
                    }
                }
            }

            newState.draftStep = prev.draftStep + 1;
            newState.selectedPick = null;
            if (prev.draftStep === 19) {
                newState.draftCompletion = true;
            }

            if (!newState.draftCompletion) {
                setActiveSide(draftOrder[newState.draftStep].side);
            }
            socketRef.current?.emit("updateDraft", roomId, newState);

            return newState;
        });
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
    console.log(role);
    return (
        <>
            {!role && (
                <SelectRole
                    roomId={roomId}
                    onClick={(value: Role) => setRole(value)}
                    socketRef={socketRef}
                />
            )}
            {draftData && role && (
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
                                draftState={draftState}
                            />
                        </div>
                        <RedTeamPanel draftState={draftState} />
                    </div>
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                        {draftState.selectedPick && role === activeSide && (
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
