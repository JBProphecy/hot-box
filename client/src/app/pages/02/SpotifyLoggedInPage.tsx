////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import { SpotifyContext, SpotifyContextType } from "@/app/context/SpotifyContext"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/config/routes"

import styles from "./SpotifyLoggedInPage.module.css"
import FancyButton, { FancyButtonSizeProps} from "@/app/components/FancyButton"
import threeColorSets from "@/app/library/threeColorSets"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fancyButtonSizeProps: FancyButtonSizeProps = {
  width: { type: "intrinsic" },
  height: { type: "absolute", value: 5, units: "rem" }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SpotifyLoggedInPage() {
  // Spotify
  const spotify: SpotifyContextType | undefined = useContext(SpotifyContext)
  if (typeof spotify === "undefined") { throw new Error("Missing Current Account Provider") }

  // Navigate
  const navigate: NavigateFunction = useNavigate()
  const loadVisualizer = () => { navigate(routes.musicVisualizerPage) }

  // Refs
  const pageRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])

  // Log Out
  const handleLogOut = () => {
    spotify.setCodeVerifier(null)
    spotify.setAccessToken(null)
    spotify.setRefreshToken(null)
  }

  // Content
  return (
    <div ref={pageRef} className={styles.page}>
      <h1>You are Logged In to Spotify</h1>
      <FancyButton
        {...fancyButtonSizeProps}
        contentType="text"
        contentValue="Check Out the Visualizer"
        pressedAction={loadVisualizer}
        activeColors={threeColorSets.set03}
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
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
