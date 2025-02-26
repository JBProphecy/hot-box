////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import useSessionStorage from "@/app/hooks/useSessionStorage"

import { useEffect, useState } from "react"

import { GetCurrentProfileDataRawBody } from "shared/types/api/GetCurrentProfileDataTypes"
import { CurrentProfileData } from "shared/types/data/private/CurrentProfileData"
import requestGetCurrentProfileData, { GetCurrentProfileDataResult } from "@/api/requestGetCurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useCurrentProfile() {
  const [id, setID] = useSessionStorage(`${clientConfig.APP_NAME}_currentProfileID`)
  const [name, setName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const sendRequests = async () => {
      if (!id) { return }
      const body: GetCurrentProfileDataRawBody = { profileID: id }
      const result: GetCurrentProfileDataResult = await requestGetCurrentProfileData(body)
      if (!result.success) {
        setID(null)
        setName(null)
        setUsername(null)
        return
      }
      const data: CurrentProfileData = result.data
      setName(data.name)
      setUsername(data.username)
    }
    sendRequests()
  }, [id])

  return { id, setID, name, setName, username, setUsername } as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
