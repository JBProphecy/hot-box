////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext } from "react"
import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"

import LoggedInProfilePage from "@/app/pages/LoggedInProfilePage"
import SignInProfilePage from "@/app/pages/SignInProfilePage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentProfilePage() {
  try {
    // Current Profile
    const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
    if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

    // Return Content
    if (currentProfile.getID) { return <LoggedInProfilePage />}
    return <SignInProfilePage />
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
