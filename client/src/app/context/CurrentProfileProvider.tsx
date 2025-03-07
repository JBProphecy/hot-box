////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"
import useCurrentProfile from "@/app/hooks/useCurrentProfile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CurrentProfileProviderProps = { children: React.ReactNode }

export default function CurrentProfileProvider({ children }: CurrentProfileProviderProps) {
  const currentProfile = useCurrentProfile()

  const currentProfileContextType: CurrentProfileContextType = {
    getID: currentProfile.id,
    setID: currentProfile.setID,
    getName: currentProfile.name,
    setName: currentProfile.setName,
    getUsername: currentProfile.username,
    setUsername: currentProfile.setUsername
  }
  
  return (
    <CurrentProfileContext.Provider value={currentProfileContextType}>
      {children}
    </CurrentProfileContext.Provider>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
