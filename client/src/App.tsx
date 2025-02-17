////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FullScreenLayout from "@/app/FullScreenLayout"
//import DevPage from "@/app/DevPage"
import EntryPage from "@/app/EntryPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import requestEnsureDeviceToken from "./api/requestEnsureDeviceToken"
import requestCreateAccount from "@/api/requestCreateAccount"
import requestSignInAccount from "@/api/requestSignInAccount"

import requestCreateProfile from "@/api/requestCreateProfile"
import requestAddProfile from "@/api/requestAddProfile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  useEffect(() => {
    const sendRequests = async () => {
      await requestEnsureDeviceToken()
      await requestCreateAccount({ name: "Jack", email: "fj@gmail.com", password: "yomama" })
      await requestSignInAccount({ email: "fj@gmail.com", password: "yomama" })
      await requestCreateProfile({ name: "Jack", username: "Yo Mama 9", password: "yomama", accountID: "cm77optde00008nfoog5vwmkk" })
      await requestAddProfile({ username: "Yo Mama 9", password: "yomama" })
    }
    sendRequests()
  }, [])
  try {
    return (
      <FullScreenLayout>
        <EntryPage />
      </FullScreenLayout>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("App Error")
    console.log(error)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
