import { ButtonProps } from "@/types"


import styles from "@/styles/components/button.module.css"

const Button = ({ text, onClick, type, icon }: ButtonProps) => {
  return (
    <button onClick={onClick} className={`${styles[type]} ${styles.buttonContainer}`}>
        {icon ? icon : null }
        <p>{text}</p>
    </button>
  )
}

export default Button