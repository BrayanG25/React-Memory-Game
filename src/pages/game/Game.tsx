import { useState, useEffect, useCallback } from 'react'

import { Card, Player } from '../../utils/DataTypes'

import styles from './Game.module.css'

const initialCards: Card[] = [
    { id: 1, name: '1', flipped: false, matched: false },
    { id: 2, name: '1', flipped: false, matched: false },
    { id: 3, name: '2', flipped: false, matched: false },
    { id: 4, name: '2', flipped: false, matched: false },
    { id: 5, name: '3', flipped: false, matched: false },
    { id: 6, name: '3', flipped: false, matched: false },
    { id: 7, name: '4', flipped: false, matched: false },
    { id: 8, name: '4', flipped: false, matched: false },
    { id: 9, name: '5', flipped: false, matched: false },
    { id: 10, name: '5', flipped: false, matched: false },
    { id: 11, name: '6', flipped: false, matched: false },
    { id: 12, name: '6', flipped: false, matched: false },
    { id: 13, name: '7', flipped: false, matched: false },
    { id: 14, name: '7', flipped: false, matched: false },
    { id: 15, name: '8', flipped: false, matched: false },
    { id: 16, name: '8', flipped: false, matched: false },
]

const initialPlayers: Player[] = [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
]

const shuffleArray = (array: Card[]): Card[] => {
    return array.sort(() => Math.random() - 0.5)
}

const Game = () => {
    /*
        Estados del juego
            1. Cartas
            2. Cartas seleccionadas
            3. Jugadores
            4. Jugador actual en el turno
            5. Ganador
    */
    const [ cards, setCards ] = useState<Card[]>(shuffleArray([...initialCards]))
    const [ selectedCards, setSelectedCards ] = useState<number[]>([])
    const [ players, setPlayers ] = useState<Player[]>(initialPlayers)
    const [ currentPlayer, setCurrentPlayer ] = useState<number>(0)
    const [ winner, setWinner ] = useState<string | null>(null)

    /*
        Manejar el click sobre la carta
            1. Marca la carta como volteada
            2. Asigna el estado global de todas las cartas del tablero
            3. Asigna la cantidad de cartas que han sido seleccionadas
    */
    const handleCardClick = (index: number) => {
        if (selectedCards.length < 2 && !cards[index].flipped) {
            const newCards = [...cards]
            newCards[index].flipped = true
            setCards(newCards)
            setSelectedCards((prev) => [...prev, index])
        }
    }

    /*
        Voltear de nuevo las cartas
            1. Valida si el indice de la carta es igual al primer o segundo argumento para marcarla como volteada
    */
    const flipBackCards = (first: number, second: number) => {
        setCards((prev) => (
            prev.map((card, index) => (
                index === first || index === second ? { ...card, flipped: false } : card
            ))
        ))
    }

    /*
        Cambiar el turno del jugador
    */
    const switchTurn = useCallback(() => {
        setCurrentPlayer((prev) => ((prev + 1) % players.length))
    }, [players.length])

    /*
        Verificar si todos los pares están emparejados
    */
    const checkForWinner = useCallback(() => {
        const allMatched = cards.every((card) => card.matched)
        if (allMatched) {
            const winningPlayer = players.reduce(
                (prev, current) => (prev.score > current.score ? prev : current), players[0]
            )
            setWinner(winningPlayer.name)
        }
    }, [cards, players]);

    /*
        Manejar las acciones
            1. Extrae la primer y segunda carta seleccionada
            2. Valida si la misma carta fue seleccionada
            3. Aumenta el puntaje del jugador
            4. Marcar las cartas como emparejadas
            5. Si no es un par, da la vuelta a las cartas después de un retraso
            6. Cambia el turno al siguiente jugador
            7. Limpia las cartas seleccionadas para el próximo turno
            8. Verificar si alguien ganó después de cada turno
    */
    useEffect(() => {
        if (selectedCards.length === 2) {
            const [ first, second ] = selectedCards
            if (cards[first].name === cards[second].name) {
                setPlayers((prev) => 
                    prev.map((player, index) => (
                        index === currentPlayer ? { ...player, score: player.score + 1 } : player
                    ))
                )
                setCards((prev) => 
                    prev.map((card, index) => (
                        index === first || index === second ? { ...card, matched: true } : card
                    ))
                )
            } else {
                setTimeout(() => flipBackCards(first, second), 1000)
                switchTurn()
            }
            setSelectedCards([])
        }
        checkForWinner();
    }, [selectedCards, cards, currentPlayer, switchTurn, checkForWinner])

    return (
        <div className="memoryGame">
            {/* Turn or Winner */}
            { winner ? (
                <div className="winner"> <h2>¡{winner} ha ganado!</h2> </div>
                ) : (
                <h2>Turno de: {players[currentPlayer].name}</h2>
            )}
            {/* Cards of game */}
            <div className={styles.board}>
                { cards.map((card, index) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(index)}
                        disabled={card.flipped || card.matched}
                        // Pendiente
                        className={`${styles.card} ${card.flipped ? styles.flipped : ""} ${card.matched ? styles.matched : ""}`}
                    >
                        {card.flipped || card.matched ? card.name : '⚜️'}
                    </button>
                ))}
            </div>
            {/* Score of game */}
            <div className="scores">
                { players.map((player) => (
                    <div key={player.id}>
                        {player.name}: {player.score} puntos
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Game