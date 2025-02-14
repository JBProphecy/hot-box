////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt, { JwtPayload } from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.secrets.JWT_SECRET

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function verifyToken(token: string) {
  try {
    const data: JwtPayload | string = jwt.verify(token, JWT_SECRET)
    if (typeof data === "string") { throw new Error("token data is a string (idk)") }
    return data
  }
  catch (object: unknown) {
    const error = object as Error
    if (error.name === "TokenExpiredError") { return "expired" }
    console.error("Error Verifying Token")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
