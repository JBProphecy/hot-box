////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import useSessionStorage from "@/hooks/useSessionStorage"

import { useEffect, useState } from "react"

import { GetCurrentProfileDataRequestBody } from "shared/api/GetCurrentProfileDataTypes"
import { CurrentProfileData } from "shared/data/CurrentProfileData"
import requestGetCurrentProfileData from "@/api/requestGetCurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useCurrentProfile() {
  const [id, setID] = useSessionStorage(`${clientConfig.APP_NAME}_currentProfileID`)
  const [name, setName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const sendRequests = async () => {
      if (!id) { return }
      const body: GetCurrentProfileDataRequestBody = { profileID: id }
      const currentProfileData: CurrentProfileData | null = await requestGetCurrentProfileData(body)
      if (currentProfileData === null) {
        console.warn("Missing Profile Data")
        setID(null)
        setName(null)
        setUsername(null)
        return
      }
      setName(currentProfileData.name)
      setUsername(currentProfileData.username)
    }
    sendRequests()
  }, [id])

  return { id, setID, name, setName, username, setUsername } as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
