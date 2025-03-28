import { ReactNode } from 'react'
import styles from './Board.module.css'

interface Props {
    children: ReactNode,
    columns: number,
}

export const Board = ({ children, columns }: Props) => {
    return (
        <div className={styles["board"]} style={ columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}}>
            {children}
        </div>
    )
}