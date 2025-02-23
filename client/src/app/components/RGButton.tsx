////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./RGButton.module.css"
import useDimensions, { Dimensions } from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"
import { useRef } from "react"
import useKeyable from "@/hooks/useKeyable"
import useClickable from "@/hooks/useClickable"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type RGButtonProps = {
  type: "icon"
  className: string
  action: Function
} | {
  type: "text"
  text: string
  action: Function
}

export default function RGButton(props: RGButtonProps) {
  try {
    // Box Ref
    const boxRef = useRef<HTMLDivElement>(null)
    const boxDimensions: Dimensions = useDimensions(boxRef)

    // Variable Styles
    const variableStyles: VariableStyles = {
      "--totalWidth": toPixelString(boxDimensions.width),
      "--totalHeight": toPixelString(boxDimensions.height)
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
        style={variableStyles}
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
    console.error("Error Loading RGB Container")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
