////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateProfileCard.module.css"
import { VariableStyles, toPixelString } from "@/utils/styles"
import useKeyable, { UseKeyableProps } from "@/hooks/useKeyable"
import { useRef } from "react"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/library/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateProfileCardProps = {
  width: number
  height: number
}

export default function CreateProfileCard(props: CreateProfileCardProps) {
  // Navigation
  const navigate: NavigateFunction = useNavigate()

  const cardRef = useRef<HTMLDivElement>(null)
  const useKeyableProps: UseKeyableProps = {
    element: cardRef,
    activeClass: styles.active,
    key: "Enter",
    action: () => navigate(routes.createProfilePage)
  }
  const { handleKeyDown, handleKeyUp } = useKeyable(useKeyableProps)
  try {
    // Variable Styles
    const variableStyles: VariableStyles = {
      "--width": toPixelString(props.width),
      "--height": toPixelString(props.height)
    }
    return (
      <div
        className={styles.card}
        style={variableStyles}
        tabIndex={0}
        ref={cardRef}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={() => {navigate(routes.createProfilePage)}}
      >
        <div className={styles.content}>
          <span>Create Profile</span>
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Create Profile Card")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
