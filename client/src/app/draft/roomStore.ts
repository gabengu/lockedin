'use server';
import { notFound } from "next/navigation"

export type Draft = "normal" | "fearless" | "ironman";

export type DraftData = {
  team1: string;
  team2: string;
  draftType: Draft;
};


const draftStore = new Map<string, DraftData>();

export async function saveDraft(id: string, data: DraftData) {
  draftStore.set(id, data);
}

export async function getDraft(id: string): Promise<DraftData | undefined> {
  if (draftStore.has(id)){
    return draftStore.get(id);
  }
  else{
    return undefined
  }
}

// Server action
export async function handleSaveDraft(data: DraftData): Promise<string> {
  const id = Math.random().toString(36).slice(2, 12);
  saveDraft(id, data);
  return id;
}