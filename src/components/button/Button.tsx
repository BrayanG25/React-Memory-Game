import styles from './Button.module.css'

interface Props {
    name: string;
    label: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export const Button = ({ name, label, type = "button", onClick }: Props) => {
    return (
        <button name={name} type={type} onClick={onClick} className={styles["custom-button"]}>
            {label}
        </button>
    )
}