import type { DraftChamps } from "./types/types";

const DEFAULT_DRAFT: DraftChamps = {
    globalBans: [],
    blueTeamBans: new Array(5).fill(null),
    redTeamBans: new Array(5).fill(null),
    blueTeamPicks: new Array(5).fill(null),
    redTeamPicks: new Array(5).fill(null),
    draftStep: 0,
    draftCompletion: false,
    selectedPick: null,
};

export class DraftManager {
    private drafts: Map<string, DraftChamps> = new Map();

    createDraft(roomId: string): DraftChamps {
        const draft = structuredClone(DEFAULT_DRAFT);
        this.drafts.set(roomId, draft);
        return draft;
    }

    getDraft(roomId: string): DraftChamps {
        return this.drafts.get(roomId) ?? this.createDraft(roomId);
    }

    updateDraft(roomId: string, newState: DraftChamps): DraftChamps {
        this.drafts.set(roomId, newState);
        return newState;
    }
}
