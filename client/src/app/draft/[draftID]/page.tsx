"use client";
import { use, useEffect, useState } from "react";
import Icons from "./icons.tsx";
import { notFound, useRouter } from "next/navigation";
import { getDraft } from "../roomStore.ts";
import Select from "@/components/select.tsx";
import { set } from "better-auth";

type DraftData = {
    team1: string;
    team2: string;
    draftType: string;
};

type PageProps = {
    draftID: string;
};

export default function DraftRoom({ params }: { params: Promise<PageProps> }) {
    const router = useRouter();
    const [draftData, setDraftData] = useState<DraftData>();
    const [roomId, setRoomId] = useState<string>("");
    useEffect(() => {
        async function getData() {
            const draftID = (await params).draftID;
            setRoomId(draftID);
            const draft = getDraft(draftID);
            const draftInfo = await draft;
            if (draftInfo === undefined) {
                router.push("/notfound");
            }
            setDraftData(draftInfo);
        }
        getData();
    }, []);

    // const [champions, setChampions] = useState({});

    // useEffect(() => {
    //   async function getChampions() {
    //     const response = await fetch(
    //       "https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json"
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch champions");
    //     }
    //     const data = await response.json();
    //     setChampions(data.data);
    //   }
    //   getChampions();
    // }, []);
    // const iconElements = Object.keys(champions).map(
    //   (name: string, index: number) => {
    //     return <Icons key={index} name={name} />;
    //   }
    // );

    return (
        <>
            {draftData && (
                <main>
                    <h1>Draft Mode: {draftData?.draftType}</h1>
                    <div>{draftData?.team1}</div>
                    <div>{draftData?.team2}</div>
                    <Select roomId={roomId} />
                </main>
            )}
        </>
    );
}
