import { useState, useEffect, useCallback } from 'react'

import { CardType, PlayerType } from '../../utils/DataTypes'

import { generateCardsFoods, shuffleArray } from '../../config/cards'
import { createPlayers } from '../../config/players'

import { Card } from '../../components/card/Card'
import { Board } from '../../components/board/Board'
import { Player } from '../../components/player/Player'
import { Button } from '../../components/button/Button'
import { RadioButton } from '../../components/radioButton/RadioButton'

import styles from './Game.module.css'

const numberOfPairs = 8
const numberOfPlayers = 2

const initialCards = generateCardsFoods(numberOfPairs)
const initialPlayers = createPlayers(numberOfPlayers)

const Game = () => {
    /*
        Estados del juego
            1. Cartas
            2. Cartas seleccionadas
            3. Cartas habilitadas
            3. Jugadores
            4. Jugador actual en el turno
            5. Ganador
    */
    const [ cards, setCards ] = useState<CardType[]>(shuffleArray([...initialCards]))
    const [ selectedCards, setSelectedCards ] = useState<number[]>([])
    const [ isDisabled, setIsDisabled ] = useState<boolean>(false)
    const [ players, setPlayers ] = useState<PlayerType[]>(initialPlayers)
    const [ currentPlayer, setCurrentPlayer ] = useState<number>(0)
    const [ winner, setWinner ] = useState<string | null>(null)

    /*
        Manejar el click sobre la carta
            1. Marca la carta como volteada
            2. Asigna el estado global de todas las cartas del tablero
            3. Asigna la cantidad de cartas que han sido seleccionadas
    */
    const handleCardClick = (index: number) => {
        if (isDisabled || selectedCards.length >= 2 || cards[index].flipped) return null

        const newCards = [...cards]
        newCards[index].flipped = true
        setCards(newCards)

        setSelectedCards((prev) => [...prev, index])
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
            setIsDisabled(true)
            const [ first, second ] = selectedCards
            if (cards[first].name === cards[second].name) {
                // Aumenta el marcador del Jugador el cual hizo un match en las cartas
                setPlayers((prev) => 
                    prev.map((player, index) => (
                        index === currentPlayer ? { ...player, score: player.score + 1 } : player
                    ))
                )
                setTimeout(() => {matchCards(first, second)}, 1000)
                setIsDisabled(false)
            } else {
                setTimeout(() => { 
                    flipBackCards(first, second)
                    switchTurn()
                    setIsDisabled(false)
                }, 1000)
            }
            setSelectedCards([])
        }
        checkForWinner();
    }, [selectedCards, cards, currentPlayer, switchTurn, checkForWinner])

    const restartGame = () => {
        // Restablece el estado de las cartas (por ejemplo, las volteas todas para empezar de nuevo)
        const shuffledCards = shuffleArray(generateCardsFoods(numberOfPairs));
        setCards(shuffledCards);
        
        // Reinicia las cartas seleccionadas
        setSelectedCards([]);
        
        // Vuelve a habilitar las cartas
        setIsDisabled(false);
        
        // Si tienes jugadores, reinicia sus puntajes y selecciona al primer jugador
        setPlayers(players.map(player => ({ ...player, score: 0 })));
        setCurrentPlayer(0);

        // Si tienes jugadores ganadores, reinicia el ganador
        setWinner(null)
    };

    // Cambia el estado de las cartas las cuales le hicieron Match
    const matchCards = (first: number, second: number) => {
        setCards((prev) => 
            prev.map((card, index) => (
                index === first || index === second ? { ...card, matched: true } : card
            ))
        )
        
    }

    return (
        <>
            {/* Turn or Winner / Score of game */}
            <div className={styles["scores"]}>
                {players.map((player) => (
                    <Player key={player.id} player={player} isActive={players[currentPlayer].name === player.name} isWinner={winner === player.name}/>
                ))}
            </div>
            {/* Cards of game */}
            <div className={styles["memoryGame"]}>
                <Board> 
                    { cards.map((card, index) => ( 
                        <Card card={card} index={index} handleCardClick={handleCardClick} key={card.id}/> 
                    ))} 
                </Board>
            </div>
            {/* Footer */}
            <div className={styles["footer"]}>
                <div style={{width: '50%', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                    <Button label='Reiniciar Juego' name='restart' key='restartButton' onClick={() => { restartGame() }}></Button>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                    <div style={{alignItems: 'left', justifyContent: 'left', display: 'flex', flexDirection: 'column', padding: '1rem', border: 'solid', borderRadius: '8px'}}>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Cantidad de Cartas:</h4>
                        <RadioButton options={
                            [
                                { label: '8', value: 'cards8' },
                                { label: '16', value: 'cards16' },
                                { label: '24', value: 'cards24' },
                                { label: '32', value: 'cards32' },
                                { label: '40', value: 'cards40' },
                            ]
                        }></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Cantidad de Jugadores:</h4>
                        <RadioButton options={
                            [
                                { label: '1', value: 'player1' },
                                { label: '2', value: 'player2' },
                                { label: '3', value: 'player3' },
                                { label: '4', value: 'player4' },
                                { label: '5', value: 'player5' },
                                { label: '6', value: 'player6' },
                            ]
                        }></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Tipo de Cartas:</h4>
                        <RadioButton options={
                            [
                                { label: 'Frutas', value: 'cardsFruits' },
                                { label: 'Números', value: 'cardsNumbers' },
                                { label: 'Emojis', value: 'cardsEmojis' },
                                { label: 'Objetos', value: 'cardsObjects' },
                            ]
                        }></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Diseño del Juego:</h4>
                        <RadioButton options={
                            [
                                { label: 'Negro', value: 'gameBlack' },
                                { label: 'Azul', value: 'gameBlue' },
                                { label: 'Verde', value: 'gameGreen' },
                                { label: 'Rojo', value: 'gameRed' },
                                { label: 'Rosado', value: 'gamePink' },
                            ]
                        }></RadioButton>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game