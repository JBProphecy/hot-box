////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./card.module.css"
import { VariableStyles } from "@/app/utils/styles/types/VariableStyles"
import { processCardStyles } from "./card"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CardStyles } from "./card"
import { PublicProfileData } from "shared/types/data/public/PublicProfileData"
import { useContext, useRef } from "react"
import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"
import { NavigateFunction, useNavigate } from "react-router-dom"

import useKeyable, { UseKeyableFunctions, UseKeyableProps } from "@/app/hooks/useKeyable"

import routes from "@/config/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ProfileCardProps = {
  cardStyles: CardStyles,
  profile: PublicProfileData,
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ProfileCard = (props: ProfileCardProps) => {
  const navigate: NavigateFunction = useNavigate()
  try {
    const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
    if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

    // References
    const cardReference = useRef<HTMLDivElement>(null)

    // Selection Function
    const handleSelection = () => {
      console.log("Profile Selected")
      currentProfile.setID(props.profile.id)
      navigate(routes.currentProfilePage)
    }
    // Keyable
    const useKeyableProps: UseKeyableProps = {
      elementRef: cardReference,
      pressedClass: localStyles.active,
      linkedKey: "Enter",
      pressedAction: handleSelection,
    }
    const { handleKeyDown, handleKeyUp } = useKeyable(useKeyableProps)

    // Variable Styles
    const variableStyles: VariableStyles = processCardStyles(props.cardStyles)

    // HTML Content
    return (
      <div
        data-object="card" data-type="profile"
        className={localStyles.card} style={variableStyles}
        tabIndex={0} ref={cardReference}
        onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}
        onClick={handleSelection}
      >
        <div className={localStyles.content}>
          <img className={localStyles.image} src="/weed.jpg" />
          <div className={localStyles.details}>
            <div className={localStyles.line}>
              <span className={localStyles.text}>{props.profile.username}</span>
            </div>
            <div className={localStyles.line}>
              <span className={localStyles.text}>{props.profile.name}</span>
            </div>
            <div className={localStyles.line}>
              <span className={localStyles.text}>{"PROFILE"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Profile Card")
    console.log(error)
    return null
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
