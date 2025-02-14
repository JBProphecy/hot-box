////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import SignInAccountBody from "shared/types/SignInAccountBody"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestSignInAccount(body: SignInAccountBody) {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/signInAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result = await response.json()
    if (response.status >= 200 && response.status < 300) { console.log(result.message) }
    else if (response.status >= 300 && response.status < 400) { console.log(result.message) }
    else if (response.status >= 400 && response.status < 500) { console.warn(result.message) }
    else if (response.status >= 500 && response.status < 600) { throw new Error(result.message) }
    else throw new Error("Unhandled Response")
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Signing In to Your Account")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
