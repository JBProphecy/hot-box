////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(() => { return localStorage.getItem(key) })

  useEffect(() => {
    if (value === null) { localStorage.removeItem(key) }
    else { localStorage.setItem(key, value) }
  }, [value])
  
  return [value, setValue] as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
