"use client";
import { act, use, useEffect, useRef, useState } from "react";
import topIcon from "@/assets/role-icons/topIcon.svg";
import jungleIcon from "@/assets/role-icons/jungleIcon.svg";
import midIcon from "@/assets/role-icons/midIcon.svg";
import adIcon from "@/assets/role-icons/adIcon.svg";
import supportIcon from "@/assets/role-icons/supportIcon.svg";
import TeamHeader from "@/components/draft/TeamHeader";
import BlueTeamPanel from "@/components/draft/BlueTeamPanel";
import RedTeamPanel from "@/components/draft/RedTeamPanel";
import ChampionGrid from "@/components/draft/ChampionGrid";
import LockInButton from "@/components/draft/LockInButton";
import ReadyForGameButton from "@/components/draft/ReadyForGameButton";
import SelectRole from "@/components/draft/SelectRole";
import { draftOrder, DraftChamps } from "./draftOrder.tsx";
import { useRouter } from "next/navigation";
import { getDraft } from "../roomStore.ts";
import { set } from "better-auth";
import io, { Socket } from "socket.io-client";
import champRoles from "@/assets/champion_roles.json";
import Image from "next/image";

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

export enum ChampionRole {
    top = "top",
    jungle = "jungle",
    mid = "mid",
    ad = "ad",
    support = "support",
    none = "none",
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
    const [searchChampion, setSearchChampion] = useState<string>("");
    const [activeSide, setActiveSide] = useState<"blue" | "red">("blue");
    const [roleSelected, setRoleSelected] = useState<ChampionRole>(
        ChampionRole.none,
    );

    const [draftState, setDraftState] = useState<DraftChamps>({
        globalBans: [],
        blueTeamBans: new Array(5).fill(null),
        redTeamBans: new Array(5).fill(null),
        blueTeamPicks: new Array(5).fill(null),
        redTeamPicks: new Array(5).fill(null),
        draftStep: 20,
        draftCompletion: true,
        readyBlue: false,
        readyRed: false,
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

    useEffect(() => {
        let roleFiltered: string[] = allChampions;
        if (roleSelected !== ChampionRole.none) {
            if (roleSelected === ChampionRole.top)
                roleFiltered = champRoles.all.top;
            if (roleSelected === ChampionRole.jungle)
                roleFiltered = champRoles.all.jungle;
            if (roleSelected === ChampionRole.mid)
                roleFiltered = champRoles.all.mid;
            if (roleSelected === ChampionRole.ad)
                roleFiltered = champRoles.all.adc;
            if (roleSelected === ChampionRole.support)
                roleFiltered = champRoles.all.support;
        }

        const finalFiltered = roleFiltered.filter((champion) =>
            champion.toLowerCase().includes(searchChampion.toLowerCase()),
        );

        setFilterChampions(finalFiltered);
    }, [searchChampion, roleSelected, allChampions]);

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

    const handleRoleClick = (role: ChampionRole) => {
        setRoleSelected((prev) => (prev === role ? ChampionRole.none : role));
    };

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
        const newState = { ...draftState };
        if (role == "blue") {
            newState.readyBlue = !draftState.readyBlue;
            socketRef.current?.emit("updateDraft", roomId, newState);
        } else if (role == "red") {
            newState.readyRed = !draftState.readyRed;
            socketRef.current?.emit("updateDraft", roomId, newState);
        }

        if (newState.readyBlue && newState.readyRed) {
            if (draftData?.draftType == "fearless") {
                newState.globalBans = [
                    ...newState.globalBans,
                    ...newState.blueTeamPicks,
                    ...newState.redTeamPicks,
                ];
            }
            if (draftData?.draftType == "ironman") {
                newState.globalBans = [
                    ...newState.globalBans,
                    ...newState.blueTeamPicks,
                    ...newState.redTeamPicks,
                    ...newState.blueTeamBans,
                    ...newState.redTeamBans,
                ];
            }

            newState.blueTeamBans = setNull(newState.blueTeamBans);
            newState.redTeamBans = setNull(newState.redTeamBans);
            newState.blueTeamPicks = setNull(newState.blueTeamPicks);
            newState.redTeamPicks = setNull(newState.redTeamPicks);
            newState.draftStep = 0;
            newState.draftCompletion = false;
            newState.readyBlue = false;
            newState.readyRed = false;
            newState.selectedPick = null;
            setActiveSide(draftOrder[0].side);
        }
        setDraftState(newState);
        socketRef.current?.emit("updateDraft", roomId, newState);
    };

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
                            <div className=" flex flex-row justify-between w-[731px] pt-1">
                                <div className=" flex flex-row w-[250px] justify-between items-center ">
                                    <div
                                        className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px] rounded-md"
                                        onClick={() =>
                                            handleRoleClick(ChampionRole.top)
                                        }
                                    >
                                        <Image
                                            src={topIcon}
                                            alt="Top Icon"
                                            className={`m-auto rounded-md ${roleSelected === ChampionRole.top ? " shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" : ""}`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div
                                        className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px] rounded-md"
                                        onClick={() =>
                                            handleRoleClick(ChampionRole.jungle)
                                        }
                                    >
                                        <Image
                                            src={jungleIcon}
                                            alt="Jungle Icon"
                                            className={`m-auto rounded-md ${roleSelected === ChampionRole.jungle ? " shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" : ""}`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div
                                        className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px] rounded-md"
                                        onClick={() =>
                                            handleRoleClick(ChampionRole.mid)
                                        }
                                    >
                                        <Image
                                            src={midIcon}
                                            alt="Mid Icon"
                                            className={`m-auto rounded-md ${roleSelected === ChampionRole.mid ? " shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" : ""}`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div
                                        className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px] rounded-md"
                                        onClick={() =>
                                            handleRoleClick(ChampionRole.ad)
                                        }
                                    >
                                        <Image
                                            src={adIcon}
                                            alt="AD Icon"
                                            className={`m-auto rounded-md ${roleSelected === ChampionRole.ad ? " shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" : ""}`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div
                                        className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px] rounded-md"
                                        onClick={() =>
                                            handleRoleClick(
                                                ChampionRole.support,
                                            )
                                        }
                                    >
                                        <Image
                                            src={supportIcon}
                                            alt="Support Icon"
                                            className={`m-auto rounded-md ${roleSelected === ChampionRole.support ? " shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" : ""}`}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                </div>
                                <input
                                    className="border-1 border-[#40865d] rounded-md focus:border-[#40865d] focus:border-2 focus:outline-none text-white placeholder:pl-[4px] pl-[10]"
                                    type="text"
                                    id="championSearchInput"
                                    name="championSearchInput"
                                    placeholder="search by name"
                                    value={searchChampion}
                                    onChange={(e) =>
                                        setSearchChampion(e.target.value)
                                    }
                                />
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
                            <ReadyForGameButton
                                onClick={restartDraft}
                                blueReady={draftState.readyBlue}
                                redReady={draftState.readyRed}
                                role={role}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
