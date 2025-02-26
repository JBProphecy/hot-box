////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./NavigationBar.module.css"

import { NavigateFunction, useNavigate } from "react-router-dom"
import { VariableStyles, toPixelString } from "@/app/utils/styles/types/VariableStyles"

import routes from "@/config/routes"

import TextButton, { TextButtonProps } from "@/app/components/buttons/TextButton"
import IconButton, { IconButtonProps } from "@/app/components/buttons/IconButton"
import threeColorSets from "@/app/library/threeColorSets"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type NavigationBarProps = {
  height: number
}

export default function NavigationBar(props: NavigationBarProps) {
  // Navigation
  const navigate: NavigateFunction = useNavigate()
  const loadTestPage = () => { navigate("/test") }
  const loadDeviceProfilesPage = () => { navigate(routes.deviceProfilesPage) }
  const loadCurrentAccountPage = () => { navigate(routes.currentAccountPage) }
  const loadCurrentProfilePage = () => { navigate(routes.currentProfilePage) }

  try {
    // Variable Styles
    const variableStyles: VariableStyles = {
      "--navigationBarHeight": toPixelString(props.height)
    }

    const sharedIconButtonProps: IconButtonProps = {
      activeColors: threeColorSets.gold
    }

    return (
      <div className={localStyles.navigationBar} style={variableStyles}>
        <ul className={localStyles.buttonList}>
          <li className={localStyles.buttonItem}>
            <IconButton
              {...sharedIconButtonProps}
              icon="bx bxs-cog"
              pressedAction={loadTestPage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <IconButton
              {...sharedIconButtonProps}
              activeColors={threeColorSets.set01}
              icon="bx bxs-user"
              pressedAction={loadCurrentAccountPage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <IconButton
              {...sharedIconButtonProps}
              activeColors={threeColorSets.set02}
              icon="bx bx-user-circle"
            />
          </li>
          <li className={localStyles.buttonItem}>
            <IconButton
              {...sharedIconButtonProps}
              activeColors={threeColorSets.set03}
              icon="bx bxs-user-detail"
            />
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
