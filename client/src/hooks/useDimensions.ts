////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Dimensions = {
  width: number
  height: number
}

export const zeroDimensions: Dimensions = { width: 0, height: 0 }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useDimensions(element: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })

  const updateDimensions = () => {
    if (element.current === null) { console.warn("Missing Element Reference"); return }
    setDimensions({
      width: element.current.offsetWidth,
      height: element.current.offsetHeight
    })
  }

  useEffect(() => {
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => { window.removeEventListener("resize", updateDimensions) }
  }, [])

  return dimensions
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
