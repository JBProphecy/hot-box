////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CurrentAccountContext, CurrentAccountContextType } from "@/app/context/CurrentAccountContext"
import useCurrentAccount from "@/app/hooks/useCurrentAccount"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CurrentAccountProviderProps = { children: React.ReactNode }

export default function CurrentAccountProvider({ children }: CurrentAccountProviderProps) {
  const currentAccount = useCurrentAccount()

  const currentAccountContextType: CurrentAccountContextType = {
    getID: currentAccount.id,
    setID: currentAccount.setID,
    getName: currentAccount.name,
    setName: currentAccount.setName
  }
  
  return (
    <CurrentAccountContext.Provider value={currentAccountContextType}>
      {children}
    </CurrentAccountContext.Provider>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
