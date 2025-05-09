// Config.tsx
import styles from "./Config.module.css";
import { Button } from "../button/Button";
import { RadioButton } from "../radioButton/RadioButton";

type ConfigProps = {
    handleOptionChangeCards: (value: string) => void;
    handleOptionChangePlayers: (value: string) => void;
    handleOptionChangeTypeCards: (value: string) => void;
    handleOptionChangeTypeColor: (value: string) => void;
    restartGame: () => void;
    smallDevice: boolean;
};

export const Config = ({
    handleOptionChangeCards,
    handleOptionChangePlayers,
    handleOptionChangeTypeCards,
    handleOptionChangeTypeColor,
    restartGame,
    smallDevice
}: ConfigProps) => {
    return (
        <div className={styles.footer}>
            <div className={styles.buttonContainer}>
                <Button label="Reiniciar Juego" name="restart" onClick={restartGame} />
            </div>
            <div className={smallDevice ? styles.fullWidth : styles.halfWidth}>
                <div className={styles.settingsContainer}>
                    <h4> Cantidad de Cartas: </h4>
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
                    />
                    <h4> Cantidad de Jugadores: </h4>
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
                    />
                    <h4> Tipo de Cartas: </h4>
                    <RadioButton 
                        options={[
                            { label: 'Frutas', value: 'cardsFruits' },
                            { label: 'Números', value: 'cardsNumbers' },
                            { label: 'Emojis', value: 'cardsEmojis' },
                            { label: 'Objetos', value: 'cardsObjects' },
                        ]}
                        defaultValue="cardsFruits"
                        onChange={handleOptionChangeTypeCards}
                    />
                    <h4> Diseño del Juego: </h4>
                    <RadioButton 
                        options={[
                            { label: 'Negro', value: 'gameBlack' },
                            { label: 'Azul', value: 'gameBlue' },
                            { label: 'Verde', value: 'gameGreen' },
                            { label: 'Rojo', value: 'gameRed' },
                            { label: 'Violeta', value: 'gamePink' },
                        ]}
                        defaultValue="gameBlue"
                        onChange={handleOptionChangeTypeColor}
                    />
                </div>
            </div>
        </div>
    );
};
