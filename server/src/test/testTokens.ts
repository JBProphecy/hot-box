////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { randomUUID, UUID } from "crypto"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/config/logger"

import DeviceTokenPayload from "@/types/DeviceTokenPayload"

import AccountTokenKeys from "@/types/AccountTokenKeys"
import AccountTokenPayload from "@/types/AccountTokenPayload"
import AccountTokens from "@/types/AccountTokens"

import ProfileTokenKeys from "@/types/ProfileTokenKeys"
import ProfileTokenPayload from "@/types/ProfileTokenPayload"
import ProfileTokens from "@/types/ProfileTokens"

import generateDeviceToken from "@/utils/generateDeviceToken"
import generateAccountTokenKeys from "@/utils/generateAccountTokenKeys"
import generateAccountTokens from "@/utils/generateAccountTokens"
import generateProfileTokenKeys from "@/utils/generateProfileTokenKeys"
import generateProfileTokens from "@/utils/generateProfileTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function testTokens() {
  logger.space()

  const deviceID: UUID = randomUUID()
  logger.message("deviceID:", deviceID)
  const deviceTokenPayload: DeviceTokenPayload = { deviceID }
  logger.message("deviceTokenPayload:", deviceTokenPayload)
  const deviceToken: string = generateDeviceToken(deviceTokenPayload)
  logger.message("deviceToken:", deviceToken)

  logger.space()

  const accountID: string = "ACCOUNTID"
  logger.message("accountID:", accountID)
  const accountTokenKeys: AccountTokenKeys = generateAccountTokenKeys(accountID)
  logger.message("accountTokenKeys:", accountTokenKeys)
  const accountTokenPayload: AccountTokenPayload = { deviceID, accountID, version: 0 }
  logger.message("accountTokenPayload:", accountTokenPayload)
  const accountTokens: AccountTokens = generateAccountTokens(accountTokenPayload)
  logger.message("accountTokens:", accountTokens)

  logger.space()

  const profileID: string = "PROFILEID"
  logger.message("profileID:", profileID)
  const profileTokenKeys: ProfileTokenKeys = generateProfileTokenKeys(profileID)
  logger.message("profileTokenKeys:", profileTokenKeys)
  const profileTokenPayload: ProfileTokenPayload = { deviceID, profileID, version: 0 }
  logger.message("profileTokenPayload:", profileTokenPayload)
  const profileTokens: ProfileTokens = generateProfileTokens(profileTokenPayload)
  logger.message("profileTokens:", profileTokens)

  logger.space()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
