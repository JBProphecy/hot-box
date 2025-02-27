////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./LoggedInProfilePage.module.css"

import { VariableStyles, toPixelString, toRemString } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"

import { useContext, useEffect, useRef } from "react"
import useDimensions, { Dimensions } from "@/app/hooks/useDimensions"

import threeColorSets from "../library/threeColorSets"

import FancyButton, { FancyButtonSizeProps} from "../components/FancyButton"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/config/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function LoggedInProfilePage() {
  try {
    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadDeviceProfilesPage = () => { navigate(routes.deviceProfilesPage) }

    // Current Profile
    const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
    if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])

    // Page Dimensions
    const pageDimensions: Dimensions = useDimensions(pageRef)

    // Dynamic Styles
    const pageSpace: number = 1
    const headerTotalHeight: number = 6
    const headerContentHeight: number = headerTotalHeight - 2 * pageSpace

    // Variable Styles
    const variables: VariableStyles = {
      "--pageWidth": toPixelString(pageDimensions.width),
      "--pageHeight": toPixelString(pageDimensions.height),
      "--pageSpace": toRemString(pageSpace),
      "--headerTotalHeight": toRemString(headerTotalHeight)
    }

    // Handle Log Out
    const handleLogOut = () => {
      currentProfile.setID(null)
      loadDeviceProfilesPage()
    }

    // Fancy Button Size Props
    const fancyButtonSizeProps: FancyButtonSizeProps = {
      width: { type: "intrinsic" },
      height: { type: "relative", percent: 100 }
    }

    // Return Content
    return (
      <div
        ref={pageRef}
        className={styles.page}
        style={variables}
      >
        <header className={styles.header}>
          <div className={styles.textBox}>
            <span>Hello {currentProfile.getName}!</span>
          </div>
          <div className={styles.iconBox}>
            <FancyButton
              {...fancyButtonSizeProps}
              contentType="text"
              contentValue="Log Out"
              pressedAction={handleLogOut}
              normalColors={{
                color1: "hsl(0, 100%, 40%)",
                color2: "hsl(0, 100%, 40%)",
                color3: "hsl(0, 100%, 60%)"
              }}
              activeColors={{
                color1: "hsl(20, 100%, 50%)",
                color2: "hsl(10, 100%, 50%)",
                color3: "hsl(0, 100%, 70%)"
              }}
            />
          </div>
        </header>
        <main className={styles.main}>
          <h2>Profile Details</h2>
          <div className={styles.line} />
          <h4>Profile ID:  <span className={styles.text}>{currentProfile.getID}</span></h4>
          <h4>Name: <span className={styles.text}>{currentProfile.getName}</span></h4>
          <h4>Username: <span className={styles.text}>{currentProfile.getUsername}</span></h4>
        </main>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Logged In Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
