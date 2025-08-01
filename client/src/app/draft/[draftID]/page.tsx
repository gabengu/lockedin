"use client";
import { useState, useEffect } from "react";
import Icons from "./icons.tsx";


export default function DraftRoom() {
  const [champions, setChampions] = useState({});
  useEffect(() => {
    async function getChampions() {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch champions");
      }
      const data = await response.json();
      setChampions(data.data);
    }
    getChampions();
  }, []);
  const iconElements = Object.keys(champions).map(
    (name: string, index: number) => {
      return <Icons key={index} name={name} />;
    }
  );

  return (
    <main className="flex flex-wrap ">
      {iconElements}
    </main>
  )
}
