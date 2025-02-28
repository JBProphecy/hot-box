////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import { SpotifyContext, SpotifyContextType } from "@/app/context/SpotifyContext"

import styles from "./SpotifyLoggedOutPage.module.css"
import FancyButton, { FancyButtonSizeProps} from "@/app/components/FancyButton"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fancyButtonSizeProps: FancyButtonSizeProps = {
  width: { type: "intrinsic" },
  height: { type: "absolute", value: 5, units: "rem" }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SpotifyLoggedOutPage() {
  // Spotify
  const spotify: SpotifyContextType | undefined = useContext(SpotifyContext)
  if (typeof spotify === "undefined") { throw new Error("Missing Current Account Provider") }

  // Refs
  const pageRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])

  // Content
  return (
    <div ref={pageRef} className={styles.page}>
      <FancyButton
        {...fancyButtonSizeProps}
        contentType="text"
        contentValue="Authorize"
        pressedAction={spotify.requestAuthorization}
      />
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
