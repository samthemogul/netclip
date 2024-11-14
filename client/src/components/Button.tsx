import { ButtonProps } from "@/types"


import styles from "@/styles/components/button.module.css"

const Button = ({ text, onClick, type, icon }: ButtonProps) => {
  return (
    <button>{text}</button>
  )
}

export default Button