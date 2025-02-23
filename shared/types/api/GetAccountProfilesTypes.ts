////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { AccountProfileData } from "shared/types/data/private/AccountProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GetAccountProfilesResponseData = {
  type: "success"
  data: AccountProfileData[]
} | {
  type: "failure" | "error"
  message: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
