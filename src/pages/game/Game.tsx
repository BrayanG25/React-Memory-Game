import { useState, useEffect, useRef, useCallback } from 'react'

import { CardType, PlayerType } from '../../utils/DataTypes'

import { cardTypeHandler } from '../../config/cards'
import { createPlayers } from '../../config/players'

import { Card } from '../../components/card/Card'
import { Board } from '../../components/board/Board'
import { Player } from '../../components/player/Player'
import { Button } from '../../components/button/Button'
import { RadioButton } from '../../components/radioButton/RadioButton'

import { PlaySoundCard } from '../../components/sound/CardSound'
import { PlaySoundError } from '../../components/sound/ErrorSound'
import { PlaySoundPoint } from '../../components/sound/PointSound'
// import { PlaySoundWin } from '../../components/sound/WinSound'

import styles from './Game.module.css'

const Game = () => {
    /*
        Configuracion
            1. Cantidad de cartas
            2. Cantidad de jugadores
            3. Tipos de cartas
            4. Tipo de Color
        Estados del juego
            1. Cartas
            2. Cartas seleccionadas
            3. Cartas habilitadas
            4. Jugadores
            5. Jugador actual en el turno
            6. Ganador
        Variables de ajuste de visualización
            1. Tamaño del dispositivo
    */   
    const [ numberOfPairs, setNumberOfPairs ] = useState<number>(4)
    const [ numberOfPlayers, setNumberOfPlayers ] = useState<number>(1)
    const [ typeCards, setTypeCards ] = useState<string>('cardsFruits')
    const [ typeColor, setTypeColor] = useState<string>("card-front")

    const [ cards, setCards ] = useState<CardType[]>(cardTypeHandler(typeCards, numberOfPairs))
    const [ selectedCards, setSelectedCards ] = useState<number[]>([])
    const [ isDisabled, setIsDisabled ] = useState<boolean>(false)
    const [ players, setPlayers ] = useState<PlayerType[]>(createPlayers(numberOfPlayers))
    const [ currentPlayer, setCurrentPlayer ] = useState<number>(0)
    const [ winner, setWinner ] = useState<string | null>(null)

    const soundRefCard = useRef<{ playAudio: () => void }>(null)  
    const soundRefError = useRef<{ playAudio: () => void }>(null)  
    const soundRefPoint = useRef<{ playAudio: () => void }>(null)  

    const [smallDevice, setSmallDevice] = useState(false)
    const [columns, setColumns] = useState(4)

    useEffect(() => {
        setCards(cardTypeHandler(typeCards, numberOfPairs))

        if (smallDevice) {
            const columnMapping = {
                20: 6,
                12: 6,
                16: 6
            };
            
            setColumns(columnMapping[numberOfPairs as keyof typeof columnMapping] || 4);
        }

    }, [numberOfPairs, smallDevice, typeCards])

    useEffect(() => {
        setPlayers(createPlayers(numberOfPlayers))
    }, [numberOfPlayers])

    /*
        Manejar el click sobre la carta
            1. Marca la carta como volteada
            2. Asigna el estado global de todas las cartas del tablero
            3. Emite el sonido de voltear la carta
            4. Asigna la cantidad de cartas que han sido seleccionadas
    */
    const handleCardClick = (index: number) => {
        if (isDisabled || selectedCards.length >= 2 || cards[index].flipped) return null

        const newCards = [...cards]
        newCards[index].flipped = true
        setCards(newCards)

        setSelectedCards((prev) => [...prev, index])

        if (soundRefCard.current) soundRefCard.current.playAudio()
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
    }, [cards, players])

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

                setTimeout(() => { if (soundRefPoint.current) soundRefPoint.current.playAudio() }, 500)
                setTimeout(() => {matchCards(first, second)}, 1000)
                setIsDisabled(false)
            } else {
                setTimeout(() => { if (soundRefError.current) soundRefError.current.playAudio() }, 500)
                    
                setTimeout(() => { 
                    flipBackCards(first, second)
                    switchTurn()
                    setIsDisabled(false)
                }, 1000)
            }
            setSelectedCards([])
        }
        checkForWinner()
    }, [selectedCards, cards, currentPlayer, switchTurn, checkForWinner])

    const restartGame = () => {
        // Restablece el estado de las cartas (por ejemplo, las volteas todas para empezar de nuevo)
        const shuffledCards = cardTypeHandler(typeCards, numberOfPairs)
        setCards(shuffledCards)
        
        // Reinicia las cartas seleccionadas
        setSelectedCards([])
        
        // Vuelve a habilitar las cartas
        setIsDisabled(false)
        
        // Si tienes jugadores, reinicia sus puntajes y selecciona al primer jugador
        setPlayers(players.map(player => ({ ...player, score: 0 })))
        setCurrentPlayer(0)

        // Si tienes jugadores ganadores, reinicia el ganador
        setWinner(null)
    }

    // Cambia el estado de las cartas las cuales le hicieron Match
    const matchCards = (first: number, second: number) => {
        setCards((prev) => 
            prev.map((card, index) => (
                index === first || index === second ? { ...card, matched: true } : card
            ))
        )
    }

    // Escucha la seleccion de la cantidad de cartas
    const handleOptionChangeCards = (value: string) => {
        try {
            const numberOfCards = parseInt(value.replace('cards', ''), 10)
            if (isNaN(numberOfCards)) throw new Error("Invalid option value cards")
            setNumberOfPairs(numberOfCards/2)
            console.log(`Game configured with ${numberOfCards} cards.`)

        } catch (error) {
            console.error("Failed to update game configuration number of cards:", error)
        }
    }

    // Escucha la seleccion de la cantidad de jugadores
    const handleOptionChangePlayers = (value: string) => {
        try {
            const numberOfPlayers = parseInt(value.replace('players', ''), 10)
            if (isNaN(numberOfPlayers)) throw new Error("Invalid option value players")
            setNumberOfPlayers(numberOfPlayers)
            console.log(`Game configured with ${numberOfPlayers} players.`)

        } catch (error) {
            console.error("Failed to update game configuration number of players:", error)
        }
    }

    // Escucha la seleccion del tipo de cartas
    const handleOptionChangeTypeCards = (value: string) => {
        try {
            if(typeof value !== 'string' || value.trim() === '') throw new Error("Invalid option value type cards")
            setTypeCards(value)
            console.log(`Game configured with ${value}.`)

        } catch (error) {
            console.error("Failed to update game configuration type of cards:", error)
        }
    }

    // Escucha la seleccion del tipo de color de juego
    const handleOptionChangeTypeColor = (color: string) => {
        switch (color) {
            case 'gameBlack':
                setTypeColor("card-front-black")
                break
            case 'gameBlue':
                setTypeColor("card-front-blue")
                break
            case 'gameGreen':
                setTypeColor("card-front-green")
                break
            case 'gameRed':
                setTypeColor("card-front-red")
                break
            case 'gamePink':
                setTypeColor("card-front-pink")
                break
            default:
                setTypeColor("card-front")
        }
    }

    // Valida el ancho del dispositivo para asignar el número de columnas
    useEffect(() => {
        const handleResize = () => {            
            if (window.innerWidth <= 428) {
                setSmallDevice(true)
            } else {
                setSmallDevice(false)
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <PlaySoundCard ref={soundRefCard} />
            <PlaySoundError ref={soundRefError} />
            <PlaySoundPoint ref={soundRefPoint} />
            {/* Turn or Winner / Score of game */}
            <div className={styles["scores"]}>
                {players.map((player) => (
                    <Player 
                        key={player.id} 
                        player={player} 
                        isActive={players[currentPlayer].name === player.name} 
                        isWinner={winner === player.name}
                    />
                ))}
            </div>
            {/* Cards of game */}
            <div className={styles["memoryGame"]}>
                <Board columns={ smallDevice ? columns : 0 }>
                    { cards.map((card, index) => ( 
                        <Card key={card.id} index={index} card={card} handleCardClick={handleCardClick} typeColor={typeColor} columns ={ smallDevice ? columns : 0 }/>
                    ))} 
                </Board>
            </div>
            {/* Footer */}
            <div className={styles["footer"]}>
                <div style={{ 
                    width: smallDevice ? '100%' : '50%', 
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                }}>
                    <Button label='Reiniciar Juego' name='restart' key='restartButton' onClick={() => { restartGame() }}></Button>
                </div>
                <div style={{
                    width: smallDevice ? '100%' : '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                }}>
                    <div style={{
                        alignItems: 'left', 
                        justifyContent: 'left', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        padding: '1rem', 
                        border: 'solid', 
                        borderRadius: '8px'
                    }}>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Cantidad de Cartas:</h4>
                        <RadioButton 
                            options={[
                                { label: '8', value: 'cards8' },
                                { label: '16', value: 'cards16' },
                                { label: '24', value: 'cards24' },
                                { label: '32', value: 'cards32' },
                                { label: '40', value: 'cards40' },
                            ]}
                            defaultValue="cards8"
                            onChange={handleOptionChangeCards}
                            ></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Cantidad de Jugadores:</h4>
                        <RadioButton 
                            options={[
                                { label: '1', value: 'players1' },
                                { label: '2', value: 'players2' },
                                { label: '3', value: 'players3' },
                                { label: '4', value: 'players4' },
                                { label: '5', value: 'players5' },
                                { label: '6', value: 'players6' },
                            ]}
                            defaultValue="players1"
                            onChange={handleOptionChangePlayers}
                        ></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Tipo de Cartas:</h4>
                        <RadioButton 
                        options={[
                                { label: 'Frutas', value: 'cardsFruits' },
                                { label: 'Números', value: 'cardsNumbers' },
                                { label: 'Emojis', value: 'cardsEmojis' },
                                { label: 'Objetos', value: 'cardsObjects' },
                            ]}
                            defaultValue="cardsFruits"
                            onChange={handleOptionChangeTypeCards}
                        ></RadioButton>
                        <h4 style={{textAlign:'center', marginTop: '6px', marginBottom: '6px'}}>Diseño del Juego:</h4>
                        <RadioButton 
                        options={[
                                { label: 'Negro', value: 'gameBlack' },
                                { label: 'Azul', value: 'gameBlue' },
                                { label: 'Verde', value: 'gameGreen' },
                                { label: 'Rojo', value: 'gameRed' },
                                { label: 'Rosado', value: 'gamePink' },
                            ]}
                            defaultValue="gameBlue"
                            onChange={handleOptionChangeTypeColor}
                        ></RadioButton>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game