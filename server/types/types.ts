export interface DraftChamps {
    globalBans: number[];
    blueTeamBans: (number | null)[];
    redTeamBans: (number | null)[];
    blueTeamPicks: (number | null)[];
    redTeamPicks: (number | null)[];
    draftStep: number; // e.g. turn count
    draftCompletion: boolean;
    readyBlue: boolean;
    readyRed: boolean;
    selectedPick: number | null;
}
