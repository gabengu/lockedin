export type DraftAction = {
  action: "pick" | "ban";
  side: "blue" | "red";
  playerIndex: number | null; 
  index: number; 
};

export const draftOrder: DraftAction[] = [
  { action: "ban",  side: "blue", playerIndex: null, index: 0 },
  { action: "ban",  side: "red",  playerIndex: null, index: 1 },
  { action: "ban",  side: "blue", playerIndex: null, index: 2 },
  { action: "ban",  side: "red",  playerIndex: null, index: 3 },
  { action: "ban",  side: "blue", playerIndex: null, index: 4 },
  { action: "ban",  side: "red",  playerIndex: null, index: 5 },

  { action: "pick", side: "blue", playerIndex: 1, index: 6 },
  { action: "pick", side: "red",  playerIndex: 1, index: 7 },
  { action: "pick", side: "red",  playerIndex: 2, index: 8 },
  { action: "pick", side: "blue", playerIndex: 2, index: 9 },
  { action: "pick", side: "blue", playerIndex: 3, index: 10 },
  { action: "pick", side: "red",  playerIndex: 3, index: 11 },

  { action: "ban",  side: "red",  playerIndex: null, index: 12 },
  { action: "ban",  side: "blue", playerIndex: null, index: 13 },
  { action: "ban",  side: "red",  playerIndex: null, index: 14 },
  { action: "ban",  side: "blue", playerIndex: null, index: 15 },

  { action: "pick", side: "red",  playerIndex: 4, index: 16 },
  { action: "pick", side: "blue", playerIndex: 4, index: 17 },
  { action: "pick", side: "blue", playerIndex: 5, index: 18 },
  { action: "pick", side: "red",  playerIndex: 5, index: 19 },
];
