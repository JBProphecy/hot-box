////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef } from "react"

import styles from "./FancyButton.module.css"
import { VariableStyles, toPixelString } from "@/utils/styles"

import useKeyable from "@/hooks/useKeyable"
import useClickable from "@/hooks/useClickable"

import { FancyColorSet } from "../types/FancyColorSet"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type FancyButtonStyles = {
  height?: number
  borderWidth?: number
  borderRadius?: number
  fontSizeMultiplier?: number
}

export type FancyButtonProps = {
  colors?: FancyColorSet
  styles?: FancyButtonStyles
  type: "icon"
  className: string
  action: Function
} | {
  colors?: FancyColorSet
  styles?: FancyButtonStyles
  type: "text"
  text: string
  action: Function
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function FancyButton(props: FancyButtonProps) {
  try {
    // Box Ref
    const boxRef = useRef<HTMLDivElement>(null)

    // Variable Styles
    const variables: VariableStyles = {}
    if (props.colors) {
      if (props.colors.color1) { variables["--color1"] = props.colors.color1 }
      if (props.colors.color2) { variables["--color2"] = props.colors.color2 }
      if (props.colors.color3) { variables["--color3"] = props.colors.color3 }
    }
    if (props.styles) {
      if (props.styles.height) { variables["--totalHeight"] = toPixelString(props.styles.height) }
      if (props.styles.borderWidth) { variables["--borderWidth"] = toPixelString(props.styles.borderWidth) }
      if (props.styles.borderRadius) { variables["--borderRadius"] = toPixelString(props.styles.borderRadius) }
      if (props.styles.fontSizeMultiplier) { variables["--fontSizeMultiplier"] = props.styles.fontSizeMultiplier }
    }

    // Process Content
    const applyContent = () => {
      switch (props.type) {
        case "icon": return <i className={props.className} />
        case "text": return <span>{props.text}</span>
        default: return <></>
      }
    }

    // Use Keyable
    const { handleKeyDown, handleKeyUp } = useKeyable({
      element: boxRef,
      activeClass: styles.active,
      key: "Enter",
      action: props.action
    })

    // Use Clickable
    const { handleMouseDown, handleMouseUp } = useClickable({
      element: boxRef,
      activeClass: styles.active,
      action: props.action
    })

    // Return Content
    return (
      <div
        ref={boxRef}
        className={styles.box}
        style={variables}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
        <div className={styles.layer}>{applyContent()}</div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Fancy Button")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
