////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import useSessionStorage from "@/hooks/useSessionStorage"

import { useEffect, useState } from "react"

import { GetCurrentAccountDataRawBody } from "shared/types/api/GetCurrentAccountDataTypes"
import { CurrentAccountData } from "shared/types/data/private/CurrentAccountData"
import requestGetCurrentAccountData, { GetCurrentAccountDataResult } from "@/api/requestGetCurrentAccountData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useCurrentAccount() {
  const [id, setID] = useSessionStorage(`${clientConfig.APP_NAME}_currentAccountID`)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const sendRequests = async () => {
      if (!id) { return }
      const body: GetCurrentAccountDataRawBody = { accountID: id }
      const result: GetCurrentAccountDataResult = await requestGetCurrentAccountData(body)
      if (!result.success) {
        setID(null)
        setName(null)
        return
      }
      const data: CurrentAccountData = result.data
      setName(data.name)
    }
    sendRequests()
  }, [id])

  return { id, setID, name, setName } as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
