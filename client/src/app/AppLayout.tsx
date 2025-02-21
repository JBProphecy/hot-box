////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./AppLayout.module.css"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import NavigationBar, { NavigationBarProps } from "@/components/NavigationBar"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type AppLayoutProps = { children: React.ReactNode }

export default function AppLayout(props: AppLayoutProps) {
  try {
    // Static Variables
    const navigationBarHeight: number = 48

    // Variable Styles
    const variableStyles: VariableStyles = {
      "--navigationBarHeight": toPixelString(navigationBarHeight)
    }

    // Return Content
    return (
      <div className={localStyles.appLayout} style={variableStyles}>
        <div className={localStyles.mainScreen}>
          {props.children}
        </div>
        <div className={localStyles.navigationBar}>
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
