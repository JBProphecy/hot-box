////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import useSessionStorage from "@/app/hooks/useSessionStorage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CLIENT_ID: string = "fd4e910233e34d8ba59845e0ae3e360c"
const REDIRECT_URL: string = "http://localhost:5173/spotify"
const AUTHORIZATION_URL: URL = new URL("https://accounts.spotify.com/authorize")
const scope = "user-read-private user-read-email user-read-playback-state"

function generateRandomString(length: number): string {
  const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const values: Uint8Array<ArrayBuffer> = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

function base64encode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useSpotify() {
  // Auth State
  const [codeVerifier, setCodeVerifier] = useSessionStorage("spotify_code_verifier")
  const [accessToken, setAccessToken] = useSessionStorage("spotify_access_token")
  const [refreshToken, setRefreshToken] = useSessionStorage("spotify_refresh_token")

  // Auth Redirect
  async function requestAuthorization() {
    const generatedCodeVerifier: string  = generateRandomString(64)
    setCodeVerifier(generatedCodeVerifier)
    const hashed: ArrayBuffer = await sha256(generatedCodeVerifier)
    const codeChallenge: string = base64encode(hashed)
    const params =  {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URL,
    }
    AUTHORIZATION_URL.search = new URLSearchParams(params).toString()
    window.location.href = AUTHORIZATION_URL.toString()
  }

  // Auth Tokens
  async function requestTokens() {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const code: string | null = urlParams.get("code")
    if (!code) { console.warn("Missing Code"); return }
    if (!codeVerifier) { console.warn("Missing Code Verifier"); return }
    const url = "https://accounts.spotify.com/api/token";
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URL,
        code_verifier: codeVerifier,
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    if (typeof response.access_token !== "string") { console.warn("Not a String"); return }
    if (typeof response.refresh_token !== "string") { console.warn("Not a String"); return }
    setAccessToken(response.access_token)
    setRefreshToken(response.refresh_token)
  }

  // Return Stuff
  return {
    requestAuthorization, requestTokens,
    codeVerifier, accessToken, refreshToken,
    setCodeVerifier, setAccessToken, setRefreshToken
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
