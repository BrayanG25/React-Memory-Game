export interface Card {
    id: number;
    name: string;
    flipped: boolean;
    matched: boolean;
}

export interface Player {
    id: number;
    name: string;
    score: number;
}