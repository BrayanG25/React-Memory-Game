import { PlayerType } from '../../utils/DataTypes';

import styles from './Player.module.css'

interface Props {
    player: PlayerType;
    isActive: boolean;
    isWinner: boolean;
}

export const Player = ({player, isActive, isWinner}: Props) => {
    return (
        <div className={`${styles["playerCard"]} ${isActive && styles["active"]} ${isWinner && styles["winner"]}`} >
            <div className={styles["playerName"]}>{player["name"]}</div>
            <div className={styles["playerScore"]}>{player["score"]}</div>
        </div>
    )
}