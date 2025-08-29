"use client";
import topIcon from "../../../assets/role-icons/topIcon.svg"
import jungleIcon from "../../../assets/role-icons/jungleIcon.svg"
import midIcon from "../../../assets/role-icons/midIcon.svg"
import adIcon from "../../../assets/role-icons/adIcon.svg"
import supportIcon from "../../../assets/role-icons/supportIcon.svg"
import champRoles from "../../../assets/champion_roles.json"
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
import Image from "next/image";

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
    const [hasRole, setHasRole] = useState<boolean>(false);

    const [allChampions, setAllChampions] = useState<string[]>([]);
    const [filterChampions, setFilterChampions] = useState<string[]>([]);
    const [activeSide, setActiveSide] = useState<"blue" | "red">("blue");

  const [selectedPick, setSelectedPick] = useState<string | null>(null);

  const [globalBans, setGlobalBans] = useState<(string | null)[]>([]);
  const [blueTeamPicks, setBlueTeamPicks] = useState(new Array(5).fill(null));
  const [redTeamPicks, setRedTeamPicks] = useState(new Array(5).fill(null));
  const [blueTeamBans, setBlueTeamBans] = useState(new Array(5).fill(null));
  const [redTeamBans, setRedTeamBans] = useState(new Array(5).fill(null));

  const [draftStep, setDraftStep] = useState<number>(20);
  const [draftCompletion, setDraftCompletion] = useState<boolean>(true);

  const [searchChampion, setSearchChampion] = useState<string>("");
  const [filterChampions, setFilterChampions] = useState<string[]>([]);
  let roleFilterChampions: string[] = []
  let searchFilterChampions: string[] = []

  const [roleSelected, setRoleSelected] = useState<Role>(Role.none);

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
      searchFilterChampions = Object.keys(data.data)
      roleFilterChampions = Object.keys(data.data)
      console.log("on start up roleFilterChampions: " + roleFilterChampions)
      console.log("on start up searchFilterChampions: " + searchFilterChampions)
    }
    getAllChampions();
    getData()
  }, [])

  useEffect(() => {
    let roleFiltered: string[] = allChampions;
    if (roleSelected !== Role.none) {
      if (roleSelected === Role.top) roleFiltered = champRoles.all.top;
      if (roleSelected === Role.jungle) roleFiltered = champRoles.all.jungle;
      if (roleSelected === Role.mid) roleFiltered = champRoles.all.mid;
      if (roleSelected === Role.adc) roleFiltered = champRoles.all.adc;
      if (roleSelected === Role.support) roleFiltered = champRoles.all.support;
    }

    const finalFiltered = roleFiltered.filter(champion =>
      champion.toLowerCase().startsWith(searchChampion.toLowerCase())
    );

    setFilterChampions(finalFiltered);
  }, [searchChampion, roleSelected, allChampions]);

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

  function addChampion (array: string[], champion: string): string[] {
    const next = [...array]
    const index = next.findIndex(e => e === null)
    if (index !== -1) next[index] = champion
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
    if (draftCompletion == false){
      const invalidPick: boolean =
        globalBans.includes(champion) ||
        blueTeamBans.includes(champion) ||
        redTeamBans.includes(champion) ||
        blueTeamPicks.includes(champion) ||
        redTeamPicks.includes(champion);

      if (invalidPick) {
        throw new Error("Champion is banned or already picked!");
      }
      else{
        setSelectedPick(champion)
      }
    }
  }

  const handleRoleClick = (role: Role) => {
    setRoleSelected(prev => (prev === role ? Role.none : role))
  }

  const handleSearch = (input: string) => {
    setSearchChampion(input)
  }

  const handleLockIn = () => {
    const step = draftOrder[draftStep];

    if(selectedPick)
      if (step.action == "ban") {
        if (step.side == "blue") {
          setBlueTeamBans(prev => addChampion(prev, selectedPick));
        }
        if (step.side == "red"){
          setRedTeamBans(prev => addChampion(prev, selectedPick));
        }
      }
      else if (step.action == "pick"){
        if (step.side == "blue") {
          setBlueTeamPicks(prev => addChampion(prev, selectedPick));
        }
        if (step.side == "red"){
          setRedTeamPicks(prev => addChampion(prev, selectedPick));
        }
      }
    setDraftStep(prev => prev + 1);
    setActiveSide(step.side);
    setSelectedPick(null)
    console.log(draftStep)

    if (draftStep == 19){
      setDraftCompletion(true)
    }
  }

  //Currently doubles as draft initiation.
  const restartDraft = () => {
    if (draftData?.draftType == "fearless" || "ironman"){
      setGlobalBans(prev => [...prev, ...blueTeamPicks, ...redTeamPicks])
      if (draftData?.draftType == "ironman"){
        setGlobalBans(prev => [...prev, ...blueTeamBans, ...redTeamBans])
      }
    }
    setDraftCompletion(false)
    setBlueTeamBans(prev => setNull([...prev]))
    setBlueTeamPicks(prev => setNull([...prev]))
    setRedTeamBans(prev => setNull([...prev]))
    setRedTeamPicks(prev => setNull([...prev]))
    setDraftStep(0)
    
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
                {draftStep == 6 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : blueTeamPicks[0] ? <SplashArt name={blueTeamPicks[0]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftStep == 9 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : blueTeamPicks[1] ? <SplashArt name={blueTeamPicks[1]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftStep == 10 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : blueTeamPicks[2] ? <SplashArt name={blueTeamPicks[2]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftStep == 17 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : blueTeamPicks[3] ? <SplashArt name={blueTeamPicks[3]} />
                    : null}
              </div>
              <div className=" border-t-2 border-r-2 border-gray-600 flex-1 ">
                {draftStep == 18 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : blueTeamPicks[4] ? <SplashArt name={blueTeamPicks[4]} />
                    : null}
              </div>
              <div className="flex flex-row">
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 0 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : blueTeamBans[0] ? <Icons name={blueTeamBans[0]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 2 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : blueTeamBans[1] ? <Icons name={blueTeamBans[1]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 4 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : blueTeamBans[2] ? <Icons name={blueTeamBans[2]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 13 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : blueTeamBans[3] ? <Icons name={blueTeamBans[3]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-r-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 15 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : blueTeamBans[4] ? <Icons name={blueTeamBans[4]} height={55} width={55} disable = {false} />
                    : null}
                </div>
              </div>
            </div>
        
        <div className="flex flex-col items-center">
          <div className=" flex flex-row justify-between w-[731px]">
            <div className=" flex flex-row w-[250px] justify-between items-center">
              <div className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px]" onClick={() => handleRoleClick("top")}>
                <Image src={topIcon} alt="Top Lane" width={30} height={30} className="m-auto"/>
              </div>
              <div className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px]" onClick={() => handleRoleClick("jungle")}>
                <Image src={jungleIcon} alt="Top Lane" width={30} height={30} className="m-auto"/>
              </div>
              <div className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px]" onClick={() => handleRoleClick("mid")}>
                <Image src={midIcon} alt="Top Lane" width={30} height={30} className="m-auto"/>
              </div>
              <div className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px]" onClick={() => handleRoleClick("ad")}>
                <Image src={adIcon} alt="Top Lane" width={30} height={30} className="m-auto"/>
              </div>
              <div className="bg-[#40865d] flex flex-col align-middle w-[40px] h-[40px]" onClick={() => handleRoleClick("support")}>
                <Image src={supportIcon} alt="Top Lane" width={30} height={30} className="m-auto"/>
              </div>
            </div>
            <input className="border-1 border-[#40865d] rounded-md focus:border-[#40865d] focus:border-2 focus:outline-none text-white placeholder:pl-[4px] pl-[10]" type="text" id="myTextInput" name="myTextInput " placeholder="search by name" value={searchChampion} onChange={(e) => handleSearch(e.target.value)} />
          </div>

          <div className=" flex flex-wrap overflow-y-auto w-[800px] h-[calc(100vh-180px)] items-center justify-center hide-scrollbar">{renderIcons()}</div>
        </div>

            <div className=" flex flex-col w-[300px]">
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftStep == 7 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : redTeamPicks[0] ? <SplashArt name={redTeamPicks[0]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftStep == 8 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : redTeamPicks[1] ? <SplashArt name={redTeamPicks[1]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftStep == 11 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : redTeamPicks[2] ? <SplashArt name={redTeamPicks[2]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftStep == 16 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : redTeamPicks[3] ? <SplashArt name={redTeamPicks[3]} />
                    : null}
              </div>
              <div className=" border-t-2 border-l-2 border-gray-600 flex-1 ">
                {draftStep == 19 && selectedPick
                    ? <SplashArt name={selectedPick} />
                    : redTeamPicks[4] ? <SplashArt name={redTeamPicks[4]} />
                    : null}
              </div>

              <div className="flex flex-row">
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 14 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : redTeamBans[4] ? <Icons name={redTeamBans[4]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 12 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : redTeamBans[3] ? <Icons name={redTeamBans[3]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 5 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : redTeamBans[2] ? <Icons name={redTeamBans[2]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 3 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : redTeamBans[1] ? <Icons name={redTeamBans[1]} height={55} width={55} disable = {false} />
                    : null}
                </div>
                <div className="border-t-2 border-l-2 border-b-2 border-gray-600 w-[60px] h-[60px]">
                  {draftStep == 1 && selectedPick
                    ? <Icons name={selectedPick} height={55} width={55} disable = {false} />
                    : redTeamBans[0] ? <Icons name={redTeamBans[0]} height={55} width={55} disable = {false}/>
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            {selectedPick && <button className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]" onClick={() => handleLockIn()}>
              Lock In
            </button>}
          </div>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            {draftCompletion && <button className="bg-[#4dab74] text-black text-[25px] w-[256px] h-[58px] rounded-xl shadow-md hover:bg-[#237244]" onClick={() => restartDraft()}>
              Ready for Game
            </button>}
          </div>
        </div>}
    </>
  )
}
