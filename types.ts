export interface TabooCardData {
  palavra: string;
  restricoes: string[];
}

export type GameState = 'idle' | 'shuffling' | 'dealing' | 'selecting' | 'revealed';
