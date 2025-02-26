////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import { VariableStyles } from "@/app/utils/styles/types/VariableStyles"

import IconButton from "../components/buttons/IconButton"
import TextButton from "../components/buttons/TextButton"

import threeColorSets, { ThreeColorSet } from "../library/threeColorSets"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {
  try {
    // Dynamic Values
    const textButtonNormalColors: ThreeColorSet = {}
    const textButtonActiveColors: ThreeColorSet = threeColorSets.set03
    const iconButtonNormalColors: ThreeColorSet = {}
    const iconButtonActiveColors: ThreeColorSet = threeColorSets.gold

    // Variable Styles
    const variables: VariableStyles = {}

    // Return Content
    return (
      <div className={styles.page} style={variables}>
        <TextButton
          text="My Button"
          height={5}
          unit="rem"
          normalColors={textButtonNormalColors}
          activeColors={textButtonActiveColors}
        />
        <IconButton
          icon="bx bxs-cog"
          size={5}
          unit="rem"
          normalColors={iconButtonNormalColors}
          activeColors={iconButtonActiveColors}
        />
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Dev Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
