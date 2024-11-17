import { ReactNode } from 'react'
import styles from './Board.module.css'

interface Props {
    children: ReactNode
}

export const Board = ({ children }: Props) => {
    return (
        <div className={styles["board"]}>
            {children}
        </div>
    )
}