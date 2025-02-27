////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import { useEffect, useRef } from "react"

import FancyButton, { FancyButtonProps } from "../components/FancyButton"
import threeColorSets from "../library/threeColorSets"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fancyButtonProps: FancyButtonProps = {
  width: {
    type: "relative",
    percent: 100
  },
  height: {
    type: "relative",
    percent: 100,
  },
  contentType: "icon",
  contentValue: "bx bxs-cog",
  activeColors: threeColorSets.gray60
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {
  // Page Stuff
  const pageRef = useRef<HTMLDivElement>(null)
  useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])

  // Return Content
  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.container}>
      <FancyButton {...fancyButtonProps} />
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
