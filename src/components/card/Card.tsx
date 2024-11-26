import { CardType } from '../../utils/DataTypes'

import styles from './Card.module.css'

interface CardProps {
    card: CardType;
    index: number;
    handleCardClick: (index: number) => void;
    typeColor: string;
}

export const Card = ({ card, index, handleCardClick, typeColor }: CardProps) => {
    return (
        <button
            onClick={() => handleCardClick(index)}
            disabled={card.flipped || card.matched}
            className={`${styles["card"]} ${card.flipped && styles["flipped"] } ${card.matched && styles["matched"] }`}
        >
            <div className={styles["card-inner"]}>
            <div className={`${styles["card-front"]} ${styles[typeColor]}`}>💎</div>
                <div className={styles["card-back"]}>{card.name}</div>
            </div>
        </button>
    )
}