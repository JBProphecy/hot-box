////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getUserData(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + accessToken },
  });
  return await response.json();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function requestCurrentlyPlayingData(accessToken: string) {
  try {
    const url = "https://api.spotify.com/v1/me/player/currently-playing"
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return await response.json()
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Getting Currently Playing Data")
    console.error(error)
    console.warn("Are You Playing Anything?")
    return null
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
