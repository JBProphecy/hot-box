////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./FancyButton.module.css"

import { toPixelString, VariableStyles } from "@/app/utils/styles/types/VariableStyles"
import calcBorderWidthPx from "@/app/utils/styles/calcBorderWidth"
import calcBorderRadiusPx from "@/app/utils/styles/calcBorderRadius"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef } from "react"
import useDimensions from "@/app/hooks/useDimensions"

import { ThreeColorSet } from "@/app/library/threeColorSets"
import useKeyable, { UseKeyableFunctions, UseKeyableProps } from "@/app/hooks/useKeyable"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type AbsoluteSizing = {
  type: "absolute"
  value: number
  units: "rem" | "em" | "px"
}

type RelativeSizing = {
  type: "relative"
  percent: number
}

type IntrinsicSizing = {
  type: "intrinsic"
}

export type FancyButtonSizeProps = {
  width: AbsoluteSizing | RelativeSizing | IntrinsicSizing
  height: AbsoluteSizing | RelativeSizing
}

export type FancyButtonProps = FancyButtonSizeProps & {
  contentType: "icon" | "text"
  contentValue: string
  normalColors?: ThreeColorSet
  activeColors?: ThreeColorSet
  pressedAction?: () => void
  heldAction?: () => void
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function FancyButton(props: FancyButtonProps) {
  // Button Stuff
  const buttonRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(buttonRef)

  // Computed Styles
  const borderWidth: number = calcBorderWidthPx(dimensions.height, 1/24, 2)
  const borderRadius: number = calcBorderRadiusPx(dimensions.height, 1/10)

  // Variable Styles
  const variables: VariableStyles = {
    "--totalWidth": toPixelString(dimensions.width),
    "--totalHeight": toPixelString(dimensions.height),
    "--borderWidth": `${borderWidth}px`,
    "--borderRadius": `${borderRadius}px`
  }

  // Width Sizing
  switch (props.width.type) {
    case "absolute":
      variables["--setWidth"] = props.width.value + props.width.units
      break
    case "relative":
      variables["--setWidth"] = props.width.percent + "%"
      break
    case "intrinsic":
      variables["--setWidth"] = "max-content"
      break
  }
  variables["--totalWidth"] = toPixelString(dimensions.width)

  // Height Sizing
  switch (props.height.type) {
    case "absolute":
      variables["--setHeight"] = props.height.value + props.height.units
      break
    case "relative":
      variables["--setHeight"] = props.height.percent + "%"
      break
  }
  variables["--totalHeight"] = toPixelString(dimensions.height)

  // Color Styles
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
    elementRef: buttonRef,
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

  // Content
  let content: JSX.Element
  switch (props.contentType) {
    case "icon": content = <i className={props.contentValue} />; break
    case "text": content = <span>{props.contentValue}</span>; break
    default: content = <></>
  }

  // Return Content
  return (
    <div
      ref={buttonRef}
      className={styles.button}
      style={variables}
      tabIndex={0}
      onKeyDown={keyableFunctions.handleKeyDown}
      onKeyUp={keyableFunctions.handleKeyUp}
      onClick={handleClick}
    >
      <div className={styles.layer}></div>
      <div className={styles.layer}>{content}</div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
