////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import localStyles from "./CurrentAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import requestGetAccountProfilesData, { GetAccountProfilesDataResult } from "@/api/requestGetAccountProfilesData"

import AccountProfileCardList from "@/components/AccountProfileCardList"

import SignInAccountPage from "@/app/pages/SignInAccountPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentAccountPage() {
  try {
    // Current Account Context
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Page Reference Stuff
    const pageRef = useRef<HTMLDivElement>(null)
    const pageDimensions = useDimensions(pageRef)
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(localStyles.visible) }, 150) }, [])

    // Account Profiles Data
    const [accountProfilesData, setAccountProfilesData] = useState<AccountProfileData[]>([])
    const updateAccountProfilesData = async () => {
      const accountID: string | null = currentAccount.getID
      if (accountID === null) { return }
      const result: GetAccountProfilesDataResult = await requestGetAccountProfilesData(accountID)
      if (!result.success) { return }
      setAccountProfilesData(result.data)
    }
    useEffect(() => { updateAccountProfilesData() }, [currentAccount.getID])

    // Variable Styles
    const variableStyles: VariableStyles = {
      "--pageWidth": toPixelString(pageDimensions.width),
      "--pageHeight": toPixelString(pageDimensions.height)
    }

    function getLoggedInContent(currentAccount: CurrentAccountContextType) {
      return (
        <div className={localStyles.page} style={variableStyles} ref={pageRef}>
          <div className={localStyles.content + " " + localStyles.loggedIn}>
            <h2>Account Details</h2>
            <div className={localStyles.line} />
            <h4>Account ID:  <span className={localStyles.text}>{currentAccount.getID}</span></h4>
            <h4>Name: <span className={localStyles.text}>{currentAccount.getName}</span></h4>
            <div className={localStyles.space} />
            <h2>Linked Profiles</h2>
            <div className={localStyles.line} />
            <AccountProfileCardList accountProfilesData={accountProfilesData} />
            <div className={localStyles.space} />
            <h2>Settings</h2>
            <div className={localStyles.line} />
          </div>
        </div>
      )
    }

    // Return Content
    return (
      currentAccount.getID ? getLoggedInContent(currentAccount) : <SignInAccountPage />
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
