////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import verifyToken from "@/utils/verifyToken"
import DeviceTokenPayload from "@/types/DeviceTokenPayload"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function verifyDeviceToken(deviceToken: string) {
  try {
    const data = verifyToken(deviceToken)
    if (data === "expired") { return "expired" }
    return data as DeviceTokenPayload
  }
  catch (object: unknown) {
    const error = object as Error
    if (error.name === "TokenExpiredError") { return "expired" }
    console.error("Error Verifying Device Token")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
