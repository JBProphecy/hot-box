////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FullScreenLayout from "@/app/FullScreenLayout"
//import DevPage from "@/app/DevPage"
import EntryPage from "@/app/EntryPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import requestProcessDeviceToken from "@/api/requestProcessDeviceToken"
import requestCreateAccount from "@/api/requestCreateAccount"
import requestSignInAccount from "@/api/requestSignInAccount"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  useEffect(() => {
    const sendRequests = async () => {
      await requestProcessDeviceToken()
      await requestCreateAccount({ name: "Jack", email: "dkdkdk@gmail.com", password: "yomama" })
      await requestSignInAccount({ email: "dk@gmail.com", password: "omama" })
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
