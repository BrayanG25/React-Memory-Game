import { useState } from 'react'

import styles from './RadioButton.module.css'

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const defaultOptions = [
  { label: 'Opción 1', value: 'option1' },
  { label: 'Opción 2', value: 'option2' },
  { label: 'Opción 3', value: 'option3' },
]

export const RadioButton = ({ options = defaultOptions, defaultValue, onChange }: Props) => {
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value)

  const handleSelect = (value: string) => {
    setSelected(value)
    if (onChange) onChange(value)
  }

  if (!options || options.length === 0) {
    throw new Error("The 'options' prop must be a non-empty array.");
  }

  return (
    <div className={styles["radio-button-container"]}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles["radio-button"]} ${
            selected === option.value ? `${styles["selected"]}` : `${styles["unselected"]}`
          }`}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}