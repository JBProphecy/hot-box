////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./AccountProfileCard.module.css"
import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const profilePictureURL: string = "/weed.jpg"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AccountProfileCardProps = {
  accountProfileData: AccountProfileData
  width: number
  height: number
}

export default function AccountProfileCard(props: AccountProfileCardProps) {
  try {
    // Variable Styles
    const variableStyles: VariableStyles = {
      "--accountProfileCardWidth": toPixelString(props.width),
      "--accountProfileCardHeight": toPixelString(props.height)
    }
    return (
      <div className={styles.accountProfileCard} style={variableStyles}>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img src={profilePictureURL} />
          </div>
          <div className={styles.detailsContainer}>
            <span>{props.accountProfileData.profileID}</span>
            <span>{props.accountProfileData.profileName}</span>
            <span>{props.accountProfileData.profileUsername}</span>
          </div>
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Account Profile Card")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
