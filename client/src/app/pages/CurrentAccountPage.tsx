////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CurrentAccountPage.module.css"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"
import useDimensions, { Dimensions } from "@/hooks/useDimensions"
import { VariableStyles, toPixelString, toRemString } from "@/utils/styles"
import SignInAccountPage from "@/app/pages/SignInAccountPage"
import { FancyButton, FancyButtonProps, FancyButtonStyles } from "@/app/modules/fancy"
import { fancyColors } from "@/app/library/fancyColors"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CurrentAccountPageProps = {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentAccountPage() {
  try {
    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Return Content (logged out)
    if (!currentAccount.getID) { return <SignInAccountPage />}

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

    // Fancy Button Styles
    const fancyButtonStyles: FancyButtonStyles = {
      height: toRemString(headerContentHeight),
    }

    // Handle Log Out
    const handleLogOut = () => {
      currentAccount.setID(null)
    }

    // Return Content (logged in)
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
              colors={fancyColors.set01}
              styles={fancyButtonStyles}
              type="text"
              text="Log Out"
              action={handleLogOut}
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
    console.error("Error Loading Current Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
