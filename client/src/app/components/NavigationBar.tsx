////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./NavigationBar.module.css"
import { VariableStyles, toPixelString } from "@/app/utils/styles/types/VariableStyles"

import routes from "@/config/routes"
import { NavigateFunction, useNavigate } from "react-router-dom"

import FancyButton, { FancyButtonSizeProps } from "@/app/components/FancyButton"
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
  const loadMusicVisualizerPage = () => { navigate(routes.musicVisualizerPage) }

  try {
    // Variable Styles
    const variableStyles: VariableStyles = {
      "--navigationBarHeight": toPixelString(props.height)
    }

    const fancyButtonSizeProps: FancyButtonSizeProps = {
      width: { type: "intrinsic" },
      height: { type: "relative", percent: 100 },
    }

    return (
      <div className={localStyles.navigationBar} style={variableStyles}>
        <ul className={localStyles.buttonList}>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.gray60}
              contentType="text"
              contentValue="Test Page" // "bx bxs-cog"
              pressedAction={loadTestPage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.gold}
              contentType="text"
              contentValue="Home Page"
            />
          </li>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.set04}
              contentType="text"
              contentValue="Device Profiles"
              pressedAction={loadDeviceProfilesPage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.set01}
              contentType="text"
              contentValue="Account Page" // "bx bxs-user"
              pressedAction={loadCurrentAccountPage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.set02}
              contentType="text"
              contentValue="Profile Page"
              pressedAction={loadCurrentProfilePage}
            />
          </li>
          <li className={localStyles.buttonItem}>
            <FancyButton
              {...fancyButtonSizeProps}
              activeColors={threeColorSets.set01}
              contentType="text"
              contentValue="Music Player"
              pressedAction={loadMusicVisualizerPage}
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
