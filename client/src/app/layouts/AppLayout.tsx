////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Outlet } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./AppLayout.module.css"
import NavigationBar from "@/app/temp/components/02/NavigationBar"
import { VariableStyles, toPixelString } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function AppLayout() {
  try {
    // Static Variables
    const navigationBarHeight: number = 60

    // Variable Styles
    const variableStyles: VariableStyles = {
      "--navigationBarHeight": toPixelString(navigationBarHeight)
    }

    // Return Content
    return (
      <div className={styles.appLayout} style={variableStyles}>
        <div className={styles.mainScreen}>
          <Outlet />
        </div>
        <div className={styles.navigationBar}>
          <NavigationBar height={navigationBarHeight} />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading App Layout")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
