////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import useSessionStorage from "@/hooks/useSessionStorage"

import { useEffect, useState } from "react"

import { GetCurrentAccountDataRequestBody } from "shared/types/api/GetCurrentAccountDataTypes"
import { CurrentAccountData } from "shared/types/data/private/CurrentAccountData"
import requestGetCurrentAccountData from "@/api/requestGetCurrentAccountData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useCurrentAccount() {
  const [id, setID] = useSessionStorage(`${clientConfig.APP_NAME}_currentAccountID`)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const sendRequests = async () => {
      if (!id) { return }
      const body: GetCurrentAccountDataRequestBody = { accountID: id }
      const currentAccountData: CurrentAccountData | null = await requestGetCurrentAccountData(body)
      if (currentAccountData === null) {
        console.warn("Missing Account Data")
        return
      }
      setName(currentAccountData.name)
    }
    sendRequests()
  }, [id])

  return { id, setID, name, setName } as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
