import { CardType } from '../../utils/DataTypes'

import styles from './Card.module.css'

interface CardProps {
    card: CardType;
    index: number;
    handleCardClick: (index: number) => void;
    typeColor: string;
    columns: number;
}

export const Card = ({ card, index, handleCardClick, typeColor, columns }: CardProps) => {
    return (
        <button
            onClick={() => handleCardClick(index)}
            disabled={card.flipped || card.matched}
            className={`${styles["card"]} ${card.flipped && styles["flipped"] } ${card.matched && styles["matched"] }`}
        >
            <div className={styles["card-inner"]}>
            <div 
                className={`${styles["card-front"]} ${styles[typeColor]}`} 
                style={{ fontSize: columns === 4 || columns === 5 ? '80px' : '50px', ...(columns > 0 ? {} : { fontSize: '80px' }) }}
            >♦</div>
                <div 
                    className={styles["card-back"]}
                    style={{
                        fontSize: columns === 4 ? '80px' : '50px',
                        ...(columns > 0 ? {} : { fontSize: '80px' })
                    }}
                >
                    {card.name}
                </div>
            </div>
        </button>
    )
}