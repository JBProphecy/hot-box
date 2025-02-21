////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./EntryPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CardList, CardListStyles } from "@/components/temp/card-list"
import { CardObject } from "@/components/temp/card"

import { PublicProfile } from "shared/data/public/PublicProfileData"
import requestGetDeviceProfiles from "@/api/requestGetCurrentDeviceProfilesData"

import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function EntryPage() {
  const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
  if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }
  
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  const [profiles, setProfiles] = useState<PublicProfile[]>([])
  useEffect(() => {
    const updateStateProfiles = async () => {
      const publicProfiles: PublicProfile[] = await requestGetDeviceProfiles()
      setProfiles(publicProfiles)
    }
    updateStateProfiles()
  }, [])

  const [cards, setCards] = useState<CardObject[]>([])
  useEffect(() => {
    const cardObjects: CardObject[] = []
    for (const profile of profiles) {
      const cardObject: CardObject = {
        type: "profile",
        data: profile
      }
      cardObjects.push(cardObject)
    }
    setCards(cardObjects)
  }, [profiles])

  const listContainerRef = useRef<HTMLDivElement>(null)
  const [listContainerWidth, listContainerHeight] = useDimensions(listContainerRef)

  // TEMPORARY
  const cardListStyles: CardListStyles = {
    containerDimensions: {
      width: listContainerWidth,
      height: listContainerHeight
    },
    space: 10
  }

  return (
    <div ref={pageRef} className={localStyles.page} style={variableStyles}>
      <div ref={listContainerRef} className={localStyles.profileMenu}>
        <CardList cardListStyles={cardListStyles} cardObjects={cards} />
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
