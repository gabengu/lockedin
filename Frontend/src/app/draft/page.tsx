"use client"
import React from "react"

export default function Draft() {

    const[draftType, setDraftType] = React.useState("normal")

    const draftDesc: Record<string, string> = {
        normal: "Standard competitive draft.",
        fearless: "Standard draft rules, but each champion may only be picked once in a series.",
        ironman: "Fearless draft rules, but bans carry over across games."
    }

    return (
        <section className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome to the WSM Drafting Tool!</h1>
            <form className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex flex-col flex-1">
                        <span className="mb-1 font-medium">Team 1 Name:</span>
                        <input
                            type="text"
                            name="team1"
                            placeholder="Team 1"
                            defaultValue="Team 1"
                            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="mb-1 font-medium">Team 2 Name:</span>
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
                    <legend className="text-lg font-semibold mb-2">Select Draft Type:</legend>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 group cursor-pointer">
                            <input
                                type="radio"
                                name="draftType"
                                value="normal"
                                defaultChecked
                                className="accent-blue-500"
                                onChange={()=>setDraftType("normal")}
                            />
                            Normal Draft
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="draftType"
                                value="fearless"
                                className="accent-blue-500"
                                onChange={()=>setDraftType("fearless")}
                            />
                            Fearless Draft
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="draftType"
                                value="ironman"
                                className="accent-blue-500"
                                onChange={()=>setDraftType("ironman")}
                            />
                            Ironman Draft
                        </label>
                    </div>
                    <p className="mt-4 text-sm text-gray-300 italic">{draftDesc[draftType]}</p>
                </fieldset>

                <button
                    type="submit"
                    className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold transition-colors">
                    Create Draft Link
                </button>
            </form>
        </section>
    );
}

