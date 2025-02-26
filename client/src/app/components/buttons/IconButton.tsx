////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./IconButton.module.css"

import { VariableStyles } from "@/app/utils/styles/types/VariableStyles"
import calcBorderWidthPx from "@/app/utils/styles/calcBorderWidth"
import calcBorderRadiusPx from "@/app/utils/styles/calcBorderRadius"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef } from "react"
import useDimensions from "@/app/hooks/useDimensions"

import { ThreeColorSet } from "@/app/library/threeColorSets"
import useKeyable, { UseKeyableFunctions, UseKeyableProps } from "@/app/hooks/useKeyable"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type IconButtonProps = {
  icon?: string
  size?: number
  unit?: string
  normalColors?: ThreeColorSet
  activeColors?: ThreeColorSet
  pressedAction?: () => void
  heldAction?: () => void
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function IconButton(props: IconButtonProps) {
  try {
    // Button Stuff
    const ref = useRef<HTMLDivElement>(null)
    const dimensions = useDimensions(ref)

    // Computed Styles
    const borderWidth: number = calcBorderWidthPx(dimensions.height, 1/24, 2)
    const borderRadius: number = calcBorderRadiusPx(dimensions.height, 1/10)

    // Variable Styles
    const variables: VariableStyles = {
      "--borderWidth": `${borderWidth}px`,
      "--borderRadius": `${borderRadius}px`
    }
    
    // Dynamic Styles
    variables["--setSize"] = (props.size && props.unit) ? props.size + props.unit : "100%"
    variables["--totalSize"] = (props.size && props.unit) ? props.size + props.unit : `${dimensions.height}px`
    if (props.normalColors) {
      if (props.normalColors.color1) variables["--normalColor1"] = props.normalColors.color1
      if (props.normalColors.color2) variables["--normalColor2"] = props.normalColors.color2
      if (props.normalColors.color3) variables["--normalColor3"] = props.normalColors.color3
    }
    if (props.activeColors) {
      if (props.activeColors.color1) variables["--activeColor1"] = props.activeColors.color1
      if (props.activeColors.color2) variables["--activeColor2"] = props.activeColors.color2
      if (props.activeColors.color3) variables["--activeColor3"] = props.activeColors.color3
    }

    // Keyable
    const keyableProps: UseKeyableProps = {
      elementRef: ref,
      pressedClass: styles.pressed,
      linkedKey: "Enter",
      pressedAction: props.pressedAction,
      heldAction: props.heldAction
    }
    const keyableFunctions: UseKeyableFunctions = useKeyable(keyableProps)

    // Click
    const handleClick = () => {
      if (props.pressedAction) { props.pressedAction() }
      else { console.log("clicked") }
    }

    // Return Content
    return (
      <div
        ref={ref}
        className={styles.container}
        style={variables}
        tabIndex={0}
        onKeyDown={keyableFunctions.handleKeyDown}
        onKeyUp={keyableFunctions.handleKeyUp}
        onClick={handleClick}
      >
        <div className={styles.layer}></div>
        <div className={styles.layer}>
          <i className={props.icon} />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Icon Button")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
