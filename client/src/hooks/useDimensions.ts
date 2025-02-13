////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useDimensions(element: React.RefObject<HTMLElement>) {
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  const setDimensions = () => {
    if (!element.current) { console.warn("Missing Element Reference"); return }
    setWidth(element.current.offsetWidth)
    setHeight(element.current.offsetHeight)
  }

  useEffect(() => {
    setDimensions()
    window.addEventListener("resize", setDimensions)
    return () => { window.removeEventListener("resize", setDimensions) }
  }, [])

  // Optional Logging
  useEffect(() => {
    console.log("Page Width:", width)
    console.log("Page Height:", height)
  }, [width, height])

  // Return Dimensions
  return [ width, height ] as const
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
