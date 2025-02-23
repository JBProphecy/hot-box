////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"
import { VariableStyles, toPixelString } from "@/utils/styles"

import styles from "./AccountSection.module.css"
import useDimensions from "@/hooks/useDimensions"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import SignInAccountPage from "@/app/SignInAccountPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type AccountSectionAttributes = {
  ref: React.RefObject<HTMLDivElement>
  className: string
  style: VariableStyles
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function AccountSection() {
  try {
    // Current Account Context
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)
    const dimensions = useDimensions(pageRef)

    // Page Styles
    const pageStyles: VariableStyles = {
      "--width": toPixelString(dimensions.width),
      "--height": toPixelString(dimensions.height)
    }

    // Page Attributes
    const pageAttributes: AccountSectionAttributes = {
      className: styles.page,
      ref: pageRef,
      style: pageStyles
    }

    // Page Effects
    useEffect(() => { pageRef.current?.classList.add(styles.visible) }, [])

    return (
      <div {...pageAttributes}></div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Account Section")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
