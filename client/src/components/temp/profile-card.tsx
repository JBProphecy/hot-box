////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./card.module.css"
import { VariableStyles } from "@/utils/styles"
import { processCardStyles } from "@/components/temp/card"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CardStyles } from "@/components/temp/card"
import { PublicProfile } from "shared/data/public/PublicProfileData"
import { useContext, useEffect, useRef, useState } from "react"
import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ProfileCardProps = {
  cardStyles: CardStyles,
  profile: PublicProfile,
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ProfileCard = ({ cardStyles, profile }: ProfileCardProps) => {
  const navigate: NavigateFunction = useNavigate()
  try {
    const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
    if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

    // References
    const cardReference = useRef<HTMLDivElement>(null)

    // States
    const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)
    const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)
    const [isStateLocked, setIsStateLocked] = useState<boolean>(false)

    // Functions
    const pressButton = () => { if (cardReference.current) {
      cardReference.current.classList.add(localStyles.active)
      setIsButtonPressed(true); lockState()
    }}
    const releaseButton = () => { if (cardReference.current) {
      cardReference.current.classList.remove(localStyles.active)
      setIsButtonPressed(false); lockState()
    }}
    const lockState = () => {
      setIsStateLocked(true)
      setTimeout(() => { setIsStateLocked(false) }, 200)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" && !isKeyPressed) {
        setIsKeyPressed(true)
        if (!isStateLocked) { pressButton() }
      }
    }
    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsKeyPressed(false)
        if (isButtonPressed && !isStateLocked) { releaseButton(); handleSelection(); }
      }
    }

    // Selection Function
    const handleSelection = () => {
      console.log("Profile Selected")
      currentProfile.setID(profile.id)
      navigate("/current/profile")
    }

    // Effects
    useEffect(() => {
      if (isKeyPressed) {
        const timer = setTimeout(() => { releaseButton() }, 500)
        return () => { clearTimeout(timer) }
      }
    }, [isKeyPressed])

    useEffect(() => {
      if (!isStateLocked && !isKeyPressed && isButtonPressed) { releaseButton(); handleSelection(); }
    }, [isStateLocked])

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Variable Styles
    const variableStyles: VariableStyles = processCardStyles(cardStyles)

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
              <span className={localStyles.text}>{profile.username}</span>
            </div>
            <div className={localStyles.line}>
              <span className={localStyles.text}>{profile.name}</span>
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
