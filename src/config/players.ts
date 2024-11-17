import { PlayerType } from "../utils/DataTypes"

export const createPlayers = (numPlayers: number): PlayerType[] => {
    const players: PlayerType[] = []

    for (let i = 1; i <= numPlayers; i++) {
        players.push({ 
            id: i, 
            name: `Jugador ${i}`, 
            score: 0 
        })
    }

    return players
}