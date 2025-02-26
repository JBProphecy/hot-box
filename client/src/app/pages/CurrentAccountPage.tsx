////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext } from "react"
import { CurrentAccountContext, CurrentAccountContextType } from "@/app/context/CurrentAccountContext"

import LoggedInAccountPage from "@/app/pages/LoggedInAccountPage"
import SignInAccountPage from "@/app/pages/SignInAccountPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentAccountPage() {
  try {
    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Return Content
    if (currentAccount.getID) { return <LoggedInAccountPage />}
    return <SignInAccountPage />
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
