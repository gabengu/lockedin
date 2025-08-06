"use client";
import { useState, useEffect } from "react";
import Icons from "./icons.tsx";
import SplashArt from "./splashArt.tsx";
import { draftOrder } from "./draftOrder.tsx"; 

export default function DraftRoom() {
  const [allChampions, setAllChampions] = useState<string[]>([]);
  const [filterChampions, setFilterChampions] = useState<string[]>([]);
  const [draftPhase, setDraftPhase] = useState<"ban" | "pick">("ban");
  const [activeSide, setActiveSide] = useState<"blue" | "red">("blue");

  const [selectedBan, setSelectedBan] = useState<string | null>(null);
  const [selectedPick, setSelectedPick] = useState<string | null>(null);

  const [blueTeamPicks, setBlueTeamPicks] = useState(new Array(5).fill(null));
  const [redTeamPicks, setRedTeamPicks] = useState(new Array(5).fill(null));
  const [blueTeamBans, setBlueTeamBans] = useState(new Array(5).fill(null));
  const [redTeamBans, setRedTeamBans] = useState(new Array(5).fill(null));
  
  
  
  useEffect(() => {
    async function getAllChampions() {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch champions");
      }
      const data = await response.json();
      setAllChampions(Object.keys(data.data));
      setFilterChampions(Object.keys(data.data));
      console.log(data.data)
    }
    getAllChampions();
  }, []);

  const renderIcons = () => {
    return filterChampions.map(
    (name: string, index: number) => {
      return(
      <div 
      key={name}
      className ="m-1 rounded hover:scale-[105%] transition-all cursor-pointer" onClick={() => handleChampionBan(name, activeSide)}>
        <Icons key={index} name={name} disable={false} height={75} width={75}/>
      </div>)
      }
    );
  }

  const handleChampionBan =(champion: string, team: "blue" | "red") => {
    if (team === "blue") {  

    }
  }


  
  const splashArtElements = Object.keys(allChampions).map(
    (name: string, index: number) => {
      return <div></div>

    })


  return (
    <div className="flex flex-col bg-black min-h-screen">
      <div className="w-full bg-gray-500 border-black border-y-2 h-[100px] flex flex-row justify-between items-center px-10">
      <h1>
        TEAM 1
      </h1>
      <h1 className="text-2xl">
        0 - 0
      </h1>
      <h1>
        TEAM 2
      </h1>
      </div>
      <div className="flex flex-row justify-between mt-20">
        <div className=" flex flex-col w-[300px]">
          <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
            <SplashArt name={"Lucian"} />
            </div>
          <div className=" border-t-2 border-r-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-r-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-r-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-r-2 border-gray-600 flex-1 "></div>
        <div className="flex flex-row">
            <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
          </div>
        </div>

        <div className=" flex flex-wrap overflow-y-auto w-[800px] h-[calc(100vh-180px)] items-center justify-center hide-scrollbar">{renderIcons()}</div>

        <div className=" flex flex-col w-[300px]">
          <div className=" border-t-2 border-l-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-l-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-l-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-l-2 border-gray-600 flex-1 "></div>
          <div className=" border-t-2 border-l-2 border-gray-600 flex-1 "></div>
          <div className="flex flex-row">
            <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
            <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]"></div>
          </div>
        </div>
      </div>
    </div>

  )
}
