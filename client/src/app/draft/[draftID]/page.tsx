"use client";
import { use, useEffect, useState } from "react";
import Icons from "./icons.tsx";
import SplashArt from "./splashArt.tsx";
import { draftOrder, DraftChamps} from "./draftOrder.tsx";
import { notFound, useRouter } from "next/navigation"
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

export default function DraftRoom({ params, }: { params: Promise<{ draftID: string }> }
) {
  const router = useRouter()
  const [draftData, setDraftData] = useState<DraftData>()

  const [roomId, setRoomId] = useState<string>("");

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
    selectedPick: null
  })

  useEffect(() => {
    async function getData() {
      const draftID = (await params).draftID
      const draft = getDraft(draftID)
      const draftInfo = (await draft)
      if (draftInfo === undefined) {
        router.push("/notfound")
      }
      setDraftData(draftInfo)
    }
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
    }
    getAllChampions();
    getData()
  }, [])

  const renderIcons = () => {
    return filterChampions.map(
      (name: string, index: number) => {
        return (
          <div
            key={name}
            className="m-1 rounded hover:scale-[105%] transition-all cursor-pointer" onClick={() => handleChampionClick(name, activeSide)}>
            <Icons key={index} name={name} disable={false} height={75} width={75} />
          </div>)
      }
    );
  }

  function addChampion (array: (string|null)[], champion: string | null): (string|null)[] {
    const next = [...array]
    const index = next.findIndex(e => e === null)
    if (index !== -1) {
      next[index] = champion
    }
    return next
  }

  function setNull(array: (string | null)[]): (string | null)[]{
    for (let i = 0; i < array.length; i++){
      array[i] = null
    }
    return array
  }

  const handleChampionClick = (champion: string, team: "blue" | "red") => {
    // For websocket implementation use
    // if (team == draftOrder[draftState.currentStep].side)
    if (draftState.draftCompletion == false){
      const invalidPick: boolean =
        draftState.globalBans.includes(champion) ||
        draftState.blueTeamBans.includes(champion) ||
        draftState.redTeamBans.includes(champion) ||
        draftState.blueTeamPicks.includes(champion) ||
        draftState.redTeamPicks.includes(champion);

      if (invalidPick) {
        throw new Error("Champion is banned or already picked!");
      }
      else{
        setDraftState(prev => ({
          ...prev,
          selectedPick: champion
        }))
      }
    }
  }

  const handleLockIn = () => {
    const step = draftOrder[draftState.draftStep];

    if(draftState.selectedPick)
      if (step.action == "ban") {
        if (step.side == "blue") {
          setDraftState(prev => ({
            ...prev,
            blueTeamBans: addChampion(prev.blueTeamBans, draftState.selectedPick)
          }));
        }
        if (step.side == "red"){
          setDraftState(prev => ({
            ...prev,
            redTeamBans: addChampion(prev.redTeamBans, draftState.selectedPick)
          }));
        }
      }
      else if (step.action == "pick"){
        if (step.side == "blue") {
          setDraftState(prev => ({
            ...prev,
            blueTeamPicks: addChampion(prev.blueTeamPicks, draftState.selectedPick)
          }));
        }
        if (step.side == "red"){
          setDraftState(prev => ({
            ...prev,
            redTeamPicks: addChampion(prev.redTeamPicks, draftState.selectedPick)
          }));
        }
      }
    setDraftState(prev => ({
      ...prev,
      draftStep: prev.draftStep + 1,
      selectedPick: null
    }))
    setActiveSide(step.side);

    if (draftState.draftStep == 19){
      setDraftState(prev =>({
        ...prev,
        draftCompletion: true
      }))
    }
  }

  //Currently doubles as draft initiation.
  const restartDraft = () => {
    if (draftData?.draftType == "fearless" || "ironman"){
      setDraftState(prev => ({
        ...prev,
        globalBans: [...prev.globalBans, ...draftState.blueTeamPicks, ...draftState.redTeamPicks]
      }))
      if (draftData?.draftType == "ironman"){
        setDraftState(prev => ({
        ...prev,
        globalBans: [...prev.globalBans, ...draftState.blueTeamBans, ...draftState.redTeamBans]
        }))
      }
    }
    setDraftState(prev =>({
      ...prev,
      blueTeamBans: setNull(prev.blueTeamBans),
      redTeamBans: setNull(prev.redTeamBans),
      blueTeamPicks: setNull(prev.blueTeamPicks),
      redTeamPicks: setNull(prev.redTeamPicks),
      draftStep: 0,
      draftCompletion: false
    }))
  }

  return (
    <>
      {draftData &&
        <div className="flex flex-col bg-black min-h-screen">
          <div className="w-full bg-gray-500 border-black border-y-2 h-[100px] flex flex-row justify-between items-center px-10">
            <h1>
              {draftData.team1}
            </h1>
            <h1 className="text-2xl">
              0 - 0
            </h1>
            <h1>
              {draftData.team2}
            </h1>
          </div>
          <div className="flex flex-row justify-between">
            <div className=" flex flex-col w-[300px]">
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 6 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.blueTeamPicks[0] ? <SplashArt name={draftState.blueTeamPicks[0]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 9 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.blueTeamPicks[1] ? <SplashArt name={draftState.blueTeamPicks[1]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 10 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.blueTeamPicks[2] ? <SplashArt name={draftState.blueTeamPicks[2]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 17 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.blueTeamPicks[3] ? <SplashArt name={draftState.blueTeamPicks[3]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 18 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.blueTeamPicks[4] ? <SplashArt name={draftState.blueTeamPicks[4]} />
                    : null}
              </div>
              <div className="flex flex-row">
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 0 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.blueTeamBans[0] ? <Icons name={draftState.blueTeamBans[0]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 2 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.blueTeamBans[1] ? <Icons name={draftState.blueTeamBans[1]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 4 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.blueTeamBans[2] ? <Icons name={draftState.blueTeamBans[2]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 13 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.blueTeamBans[3] ? <Icons name={draftState.blueTeamBans[3]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 15 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.blueTeamBans[4] ? <Icons name={draftState.blueTeamBans[4]} height={55} width={55} disable = {false} />
                    : null}
                </div>
              </div>
            </div>
        
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
                <input className="" type="text" id="myTextInput" name="myTextInput" />
              </div>
          </div>

          <div className=" flex flex-wrap overflow-y-auto w-[800px] h-[calc(100vh-180px)] items-center justify-center hide-scrollbar">{renderIcons()}</div>
        </div>

            <div className=" flex flex-col w-[300px]">
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 7 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.redTeamPicks[0] ? <SplashArt name={draftState.redTeamPicks[0]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 8 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.redTeamPicks[1] ? <SplashArt name={draftState.redTeamPicks[1]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 11 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.redTeamPicks[2] ? <SplashArt name={draftState.redTeamPicks[2]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 16 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.redTeamPicks[3] ? <SplashArt name={draftState.redTeamPicks[3]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftState.draftStep == 19 && draftState.selectedPick
                    ? <SplashArt name={draftState.selectedPick} />
                    : draftState.redTeamPicks[4] ? <SplashArt name={draftState.redTeamPicks[4]} />
                    : null}
              </div>

              <div className="flex flex-row">
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 14 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.redTeamBans[4] ? <Icons name={draftState.redTeamBans[4]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 12 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.redTeamBans[3] ? <Icons name={draftState.redTeamBans[3]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 5 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.redTeamBans[2] ? <Icons name={draftState.redTeamBans[2]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 3 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.redTeamBans[1] ? <Icons name={draftState.redTeamBans[1]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftState.draftStep == 1 && draftState.selectedPick
                    ? <Icons name={draftState.selectedPick} height={55} width={55} disable = {false} />
                    : draftState.redTeamBans[0] ? <Icons name={draftState.redTeamBans[0]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            {draftState.selectedPick && <button className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]" onClick={() => handleLockIn()}>
              Lock In
            </button>}
          </div>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            {draftState.draftCompletion && <button className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]" onClick={() => restartDraft()}>
              Ready for Game
            </button>}
          </div>
        </div>}
    </>
  )
}