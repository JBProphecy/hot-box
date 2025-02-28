////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext } from "react"
import { SpotifyContext, SpotifyContextType } from "@/app/context/SpotifyContext"

import SpotifyLoggedInPage from "./SpotifyLoggedInPage"
import SpotifyLoggedOutPage from "./SpotifyLoggedOutPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SpotifyPage() {
  // Spotify
  const spotify: SpotifyContextType | undefined = useContext(SpotifyContext)
  if (typeof spotify === "undefined") { throw new Error("Missing Current Account Provider") }

  // Necessary for Redirect
  if (spotify.codeVerifier && !spotify.accessToken) { spotify.requestTokens() }

  // Content
  return spotify.accessToken ? <SpotifyLoggedInPage /> : <SpotifyLoggedOutPage />
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
