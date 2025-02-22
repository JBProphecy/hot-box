////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import localStyles from "./CurrentAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import { GetAccountProfilesRawBody } from "shared/types/api/GetAccountProfilesTypes"
import requestGetAccountProfilesData, { GetAccountProfilesDataResult } from "@/api/requestGetAccountProfilesData"

import AccountProfileCardList from "@/components/AccountProfileCardList"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentAccountPage() {
  try {
    // Current Account Context
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Page Reference Stuff
    const pageRef = useRef<HTMLDivElement>(null)
    const pageDimensions = useDimensions(pageRef)
    useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])

    // Account Profiles Data
    const [accountProfilesData, setAccountProfilesData] = useState<AccountProfileData[]>([])
    const updateAccountProfilesData = async () => {
      const accountID: string | null = currentAccount.getID
      if (accountID === null) { return }
      const body: GetAccountProfilesRawBody = { accountID: accountID }
      const result: GetAccountProfilesDataResult = await requestGetAccountProfilesData(body)
      if (!result.success) { return }
      setAccountProfilesData(result.data)
    }
    useEffect(() => { updateAccountProfilesData() }, [currentAccount.getID])

    // Variable Styles
    const variableStyles: VariableStyles = {
      "--pageWidth": toPixelString(pageDimensions.width),
      "--pageHeight": toPixelString(pageDimensions.height)
    }

    // Styles
    const loggedOutStyles = `
      ${localStyles.page}
      ${localStyles.loggedOut}
    `

    // Return Content
    if (currentAccount.getID) {
      return (
        <div ref={pageRef} className={localStyles.page} style={variableStyles}>
          <div className={localStyles.content}>
            <h2>Account Details</h2>
            <div className={localStyles.line} />
            <h4>Account ID:  <span className={localStyles.text}>{currentAccount.getID}</span></h4>
            <h4>Name: <span className={localStyles.text}>{currentAccount.getName}</span></h4>
            <div className={localStyles.space} />
            <h2>Linked Profiles</h2>
            <div className={localStyles.line} />
            <AccountProfileCardList accountProfilesData={accountProfilesData} />
          </div>
        </div>
      )
    }
    else {
      return (
        <div ref={pageRef} className={loggedOutStyles} style={variableStyles}>
          <h1>Current Account Page</h1>
          <h2>You are Logged Out</h2>
        </div>
      )
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
