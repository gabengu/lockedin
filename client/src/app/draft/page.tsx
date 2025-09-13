"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleSaveDraft } from "./roomStore";
import NavBar from "@/components/navbar";

export default function Draft() {
    const router = useRouter();
    type Draft = "normal" | "fearless" | "ironman";
    const [draftType, setDraftType] = useState<Draft>("normal");

    const [draftLink, setDraftLink] = useState<string | null>(null);

    const draftDesc: Record<Draft, string> = {
        normal: "Standard competitive snake draft.",
        fearless:
            "Standard draft rules, but each champion may only be picked once in a series.",
        ironman: "Fearless draft rules, but bans carry over across games.",
    };

    type DraftData = {
        team1: string;
        team2: string;
        draftType: Draft;
    };

    let data: DraftData;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data = {
            team1: formData.get("team1") as string,
            team2: formData.get("team2") as string,
            draftType: formData.get("draftType") as Draft,
        };
        //console.log("creating draft with:", data)
        const id = await handleSaveDraft(data);
        setDraftLink(id);
        console.log("id: " + id);
        //console.log("generated link: " + draftLink)
    }

    return (
        <div className="w-[1440px] h-[1024px] relative bg-neutral-900 overflow-hidden">
            <div className="w-[551px] h-20 left-[444px] top-[195px] absolute text-center justify-center text-zinc-100 text-5xl font-normal font-['Sprintura_Demo']">
                WSM DRAFT TOOL
            </div>
            <div className="w-[734px] h-[521px] left-[353px] top-[348px] absolute bg-gray-600 blur-[100px]" />
            <div className="w-[734px] h-[521px] left-[353px] top-[348px] absolute bg-neutral-900/80 rounded-[20px] border border-emerald-300 backdrop-blur-blur" />
            <div className="w-56 h-10 left-[445px] top-[420px] absolute bg-stone-500 rounded-[10px] border border-zinc-100" />
            <div className="w-56 h-16 left-[445px] top-[369px] absolute justify-center text-zinc-100 text-xl font-normal font-['Sprintura_Demo']">
                TEAM 1 NAME
            </div>
            <div className="w-48 h-9 left-[462px] top-[423px] absolute justify-center text-zinc-100 text-xl font-bold font-['Roboto']">
                Insert name
            </div>
            <div className="w-56 h-10 left-[769px] top-[420px] absolute bg-stone-500 rounded-[10px] border border-zinc-100" />
            <div className="w-56 h-16 left-[769px] top-[370px] absolute justify-center text-zinc-100 text-xl font-normal font-['Sprintura_Demo']">
                TEAM 2 NAME
            </div>
            <div className="w-48 h-9 left-[796px] top-[423px] absolute justify-center text-zinc-100 text-xl font-bold font-['Roboto']">
                Insert name
            </div>
            <div className="w-56 h-10 left-[458px] top-[773px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.50)]" />
            <div className="w-44 h-4 left-[487px] top-[785px] absolute text-center justify-center text-neutral-900 text-xl font-normal font-['Sprintura_Demo']">
                Copy link
            </div>
            <div className="w-56 h-10 left-[756px] top-[773px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.50)]" />
            <div className="w-44 h-4 left-[779px] top-[785px] absolute text-center justify-center text-neutral-900 text-xl font-normal font-['Sprintura_Demo']">
                Go to draft
            </div>
            <div className="w-56 h-10 left-[606px] top-[707px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.50)]" />
            <div className="w-44 h-4 left-[629px] top-[719px] absolute text-center justify-center text-neutral-900 text-xl font-normal font-['Sprintura_Demo']">
                Create Link
            </div>
            <div className="w-96 h-16 left-[540px] top-[489px] absolute text-center justify-center text-zinc-100 text-2xl font-normal font-['Sprintura_Demo']">
                SELECT DRAFT TYPE
            </div>
            <div className="w-36 h-12 left-[471px] top-[550px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)] border border-neutral-600" />
            <div className="w-32 h-9 left-[481px] top-[556px] absolute text-center justify-center text-neutral-900 text-base font-normal font-['Sprintura_Demo']">
                Normal
            </div>
            <div className="w-36 h-12 left-[645px] top-[550px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)] border border-neutral-600" />
            <div className="w-36 h-9 left-[648px] top-[555px] absolute text-center justify-center text-neutral-900 text-base font-normal font-['Sprintura_Demo']">
                Fearless
            </div>
            <div className="w-36 h-12 left-[819px] top-[550px] absolute bg-green-400 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)] border border-neutral-600" />
            <div className="w-36 h-9 left-[824px] top-[555px] absolute text-center justify-center text-neutral-900 text-base font-normal font-['Sprintura_Demo']">
                Ironman
            </div>
            <div className="w-36 h-5 left-[651px] top-[622px] absolute text-center justify-center text-zinc-100 text-xl font-bold font-['Roboto']">
                Description.
            </div>
            <div className="w-[1440px] h-32 left-0 top-0 absolute bg-black/50" />
            <div className="w-[1128px] h-0 left-[144px] top-[134px] absolute bg-red-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-[5px] outline-offset-[-2.50px] outline-black/0"></div>
            <div className="w-40 h-20 left-[67px] top-[28px] absolute bg-zinc-400" />
            <div className="w-28 h-5 left-[92px] top-[45.99px] absolute text-center justify-start text-black text-3xl font-normal font-['Sprintura_Demo']">
                Logo
            </div>
            <div className="w-28 h-5 left-[92px] top-[45.99px] absolute text-center justify-start text-black text-3xl font-normal font-['Sprintura_Demo']">
                Logo
            </div>
            <div className="w-80 h-14 left-[248px] top-[38px] absolute justify-center text-zinc-100 text-4xl font-normal font-['Sprintura_Demo']">
                lockedin
            </div>
            <div className="w-28 h-14 left-[951px] top-[45px] absolute text-center justify-center text-zinc-100 text-xl font-normal font-['Sprintura_Demo']">
                About
            </div>
            <div className="w-28 h-14 left-[1153px] top-[45px] absolute text-center justify-center text-zinc-300 text-xl font-normal font-['Sprintura_Demo']">
                meowguy
            </div>
            <img
                className="w-14 h-14 left-[1314px] top-[31px] absolute rounded-full"
                src="https://placehold.co/60x60"
            />
            <div className="left-[16px] top-[978px] absolute text-center justify-start text-stone-500 text-3xl font-bold font-['Alumni_Sans']">
                RIOT DISCLAIMER
            </div>
        </div>
    );
}

/*             <NavBar />
            <h1 className="text-2xl font-bold mb-6 text-center flex flex-row justify-center items-center">
                Welcome to the WSM Drafting Tool!
            </h1>
            <div className=" min-h-screen bg-gray-800 flex flex-col justify-center items-center p-4">
                <section className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg justify-center items-center">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col sm:flex-row gap-6">
                            <label className="flex flex-col flex-1">
                                <span className="mb-1 font-medium">
                                    Team 1 Name:
                                </span>
                                <input
                                    type="text"
                                    name="team1"
                                    placeholder="Team 1"
                                    defaultValue="Team 1"
                                    className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>
                            <label className="flex flex-col flex-1">
                                <span className="mb-1 font-medium">
                                    Team 2 Name:
                                </span>
                                <input
                                    type="text"
                                    name="team2"
                                    placeholder="Team 2"
                                    defaultValue="Team 2"
                                    className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        <fieldset className="border border-gray-700 rounded-md p-4">
                            <legend className="text-lg font-semibold mb-2">
                                Select Draft Type:
                            </legend>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="draftType"
                                        value="normal"
                                        defaultChecked
                                        className="accent-blue-500"
                                        onChange={() => setDraftType("normal")}
                                    />
                                    Normal Draft
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="draftType"
                                        value="fearless"
                                        className="accent-blue-500"
                                        onChange={() =>
                                            setDraftType("fearless")
                                        }
                                    />
                                    Fearless Draft
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="draftType"
                                        value="ironman"
                                        className="accent-blue-500"
                                        onChange={() => setDraftType("ironman")}
                                    />
                                    Ironman Draft
                                </label>
                            </div>
                            <p className="mt-4 text-sm text-gray-300 italic">
                                {draftDesc[draftType]}
                            </p>
                        </fieldset>

                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold transition-colors"
                        >
                            Create Draft Link
                        </button>
                    </form>
                    {draftLink && (
                        <div className="mt-4 space-x-2">
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        window.location.origin +
                                            "/draft/" +
                                            draftLink,
                                    )
                                }
                                className="px-4 py-2 bg-gray-700 text-white rounded"
                            >
                                Copy Draft Link
                            </button>
                            <button
                                onClick={() =>
                                    router.push("/draft/" + draftLink)
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Go to Draft
                            </button>
                        </div>
                    )}
                </section>
            </div> */
