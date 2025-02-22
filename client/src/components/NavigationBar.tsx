////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./NavigationBar.module.css"

import { NavigateFunction, useNavigate } from "react-router-dom"
import { VariableStyles, toPixelString } from "@/utils/styles"

import routes from "@/library/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type NavigationBarProps = {
  height: number
}

export default function NavigationBar(props: NavigationBarProps) {
  // Navigation
  const navigate: NavigateFunction = useNavigate()
  const loadDeviceProfilesPage = () => { navigate(routes.deviceProfilesPage) }
  const loadCurrentAccountPage = () => { navigate(routes.currentAccountPage) }
  const loadCurrentProfilePage = () => { navigate(routes.currentProfilePage) }

  try {
    // Variable Styles
    const variableStyles: VariableStyles = {
      "--navigationBarHeight": toPixelString(props.height)
    }

    return (
      <div className={localStyles.navigationBar} style={variableStyles}>
        <ul className={localStyles.buttonList}>
          <li tabIndex={0} className={localStyles.buttonItem} onClick={loadDeviceProfilesPage}>
            <i className={`${localStyles.buttonIcon} bx bx-menu`} />
          </li>
          <li tabIndex={0} className={localStyles.buttonItem} onClick={loadCurrentAccountPage}>
            <span className={localStyles.buttonIcon}>A</span>
          </li>
          <li tabIndex={0} className={localStyles.buttonItem} onClick={loadCurrentProfilePage}>
            <span className={localStyles.buttonIcon}>P</span>
          </li>
          <li tabIndex={0} className={localStyles.buttonItem} onClick={loadCurrentProfilePage}>
            <span className={localStyles.buttonIcon}>S</span>
          </li>
        </ul>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Navigation Bar")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
