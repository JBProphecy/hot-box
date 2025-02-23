////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./FancyInput.module.css"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type FancyInputProps = {
  height: number
  label?: string
  id?: string
  type?: string
  name?: string
  value?: string
  placeholder?: string
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FancyInput(props: FancyInputProps) {
  try {
    // Variable Styles
    const variables: VariableStyles = {
      "--totalHeight": toPixelString(props.height)
    }

    // Return Content
    return (
      <div className={styles.box} style={variables}>
        <label className={styles.label} htmlFor={props.id}>{props.label}</label>
        <div className={styles.inputBox}>
          <div className={styles.layer}></div>
          <div className={styles.layer}></div>
          <input
            className={styles.input}
            id={props.id}
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder}
          />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Fancy Input")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
