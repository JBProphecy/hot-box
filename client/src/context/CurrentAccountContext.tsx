////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { createContext, Dispatch, SetStateAction } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CurrentAccountContextType = {
  getID: string | null
  setID: Dispatch<SetStateAction<string | null>>
  getName: string | null
  setName: Dispatch<SetStateAction<string | null>>
}

export const CurrentAccountContext = createContext<CurrentAccountContextType | undefined>(undefined)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
