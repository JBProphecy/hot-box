////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./FancyInput.module.css"

import { FancyColorSet } from "../types/FancyColorSet"
import { VariableStyles } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type FancyInputStyles = {
  height?: string
  flexDirection?: "column" | "row"
  borderWidth?: string
  borderRadius?: string
  fontSizeMultiplier?: number
}

export type FancyInputProps = {
  colors?: FancyColorSet
  styles?: FancyInputStyles
  label?: string
  id?: string
  type?: string
  name?: string
  value?: string
  placeholder?: string
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function FancyInput(props: FancyInputProps) {
  try {
    // Variable Styles
    const variables: VariableStyles = {}
    if (props.colors) {
      if (props.colors.color1) { variables["--color1"] = props.colors.color1 }
      if (props.colors.color2) { variables["--color2"] = props.colors.color2 }
      if (props.colors.color3) { variables["--color3"] = props.colors.color3 }
    }
    if (props.styles) {
      if (props.styles.height) { variables["--height"] = props.styles.height }
      if (props.styles.flexDirection) { variables["--flexDirection"] = props.styles.flexDirection }
      if (props.styles.borderWidth) { variables["--borderWidth"] = props.styles.borderWidth }
      if (props.styles.borderRadius) { variables["--borderRadius"] = props.styles.borderRadius }
      if (props.styles.fontSizeMultiplier) { variables["--fontSizeMultiplier"] = props.styles.fontSizeMultiplier }
    }

    // Return Content
    return (
      <div className={styles.box} style={variables}>
        <div className={styles.labelBox}>
          <label className={styles.label} htmlFor={props.id}>{props.label}</label>
        </div>
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
            required={props.required}
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
