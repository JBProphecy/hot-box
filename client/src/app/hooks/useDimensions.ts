////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useLayoutEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Dimensions = {
  width: number
  height: number
}

export const zeroDimensions: Dimensions = { width: 0, height: 0 }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useDimensions(element: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (element.current === null) { console.warn("Missing Element Reference"); return }
    setDimensions({
      width: element.current.offsetWidth,
      height: element.current.offsetHeight
    })
    const observer = new ResizeObserver(() => {
      setDimensions({
        width: element.current!.offsetWidth,
        height: element.current!.offsetHeight
      })
    })
    observer.observe(element.current)
    return () => { observer.disconnect() }
  }, [])

  return dimensions
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
