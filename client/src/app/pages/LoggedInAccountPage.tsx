////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./LoggedInAccountPage.module.css"

import { VariableStyles, toPixelString, toRemString } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CurrentAccountContext, CurrentAccountContextType } from "@/app/context/CurrentAccountContext"

import { useContext, useEffect, useRef } from "react"
import useDimensions, { Dimensions } from "@/app/hooks/useDimensions"

import threeColorSets from "../library/threeColorSets"

import FancyButton, { FancyButtonSizeProps} from "../components/FancyButton"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/config/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function LoggedInAccountPage() {
  try {
    // Navigation
    const navigate: NavigateFunction = useNavigate()

    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

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

    // Handle Create Account
    const loadCreateProfilePage = () => { navigate(routes.createProfilePage) }

    // Handle Log Out
    const handleLogOut = () => {
      currentAccount.setID(null)
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
            <span>Hello {currentAccount.getName}!</span>
          </div>
          <div className={styles.iconBox}>
            <FancyButton
              {...fancyButtonSizeProps}
              contentType="text"
              contentValue="Create Profile"
              pressedAction={loadCreateProfilePage}
              normalColors={{
                color1: "rgb(176, 176, 0)",
                color2: "rgb(200, 128, 0)",
                color3: "rgb(200, 200, 200)"
              }}
              activeColors={threeColorSets.gold}
            />
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
          <h2>Account Details</h2>
          <div className={styles.line} />
          <h4>Account ID:  <span className={styles.text}>{currentAccount.getID}</span></h4>
          <h4>Name: <span className={styles.text}>{currentAccount.getName}</span></h4>
          <div className={styles.space} />
          <h2>Linked Profiles</h2>
          <div className={styles.line} />
        </main>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Logged In Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
