////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { SpotifyContext, SpotifyContextType } from "@/app/context/SpotifyContext"
import useSpotify from "@/app/hooks/useSpotify"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SpotifyProviderProps = { children: React.ReactNode }

export default function SpotifyProvider({ children }: SpotifyProviderProps) {
  const spotify = useSpotify()

  const spotifyContextType: SpotifyContextType = {
    requestAuthorization: spotify.requestAuthorization,
    requestTokens: spotify.requestTokens,
    codeVerifier: spotify.codeVerifier,
    accessToken: spotify.accessToken,
    refreshToken: spotify.refreshToken,
    setCodeVerifier: spotify.setCodeVerifier,
    setAccessToken: spotify.setAccessToken,
    setRefreshToken: spotify.setRefreshToken
  }
  
  return (
    <SpotifyContext.Provider value={spotifyContextType}>
      {children}
    </SpotifyContext.Provider>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
