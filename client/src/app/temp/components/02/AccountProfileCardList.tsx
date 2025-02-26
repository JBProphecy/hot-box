////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./AccountProfileCardList.module.css"
import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import AccountProfileCard, { AccountProfileCardProps } from "./AccountProfileCard"
import useDimensions, { Dimensions } from "@/app/hooks/useDimensions"
import { useEffect, useRef } from "react"

import CreateProfileCard from "./CreateProfileCard"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AccountProfileCardListProps = {
  accountProfilesData: AccountProfileData[]
}
export default function AccountProfileCardList(props: AccountProfileCardListProps) {
  const { accountProfilesData } = props
  try {
    // Dimensions
    const accountProfileCardListContainerRef = useRef<HTMLDivElement>(null)
    const dimensions: Dimensions = useDimensions(accountProfileCardListContainerRef)

    return (
      <div ref={accountProfileCardListContainerRef} className={styles.accountProfileCardListContainer}>
        <ul className={styles.accountProfileCardList}>
          {accountProfilesData.map(accountProfileData => (
            <li key={accountProfileData.profileID}>
              <AccountProfileCard accountProfileData={accountProfileData} width={dimensions.width} height={100} />
            </li>
          ))}
          <li key={"create-account"}>
            <CreateProfileCard width={dimensions.width} height={100} />
          </li>
        </ul>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Account Profile Card List")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
