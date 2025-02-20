////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./DeviceProfilesPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Context

import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Components

import { CardList, CardListStyles } from "@/components/temp/card-list"
import { CardObject } from "@/components/temp/card"

import { CurrentProfileData } from "shared/data/private/CurrentProfileData"
import requestGetDeviceProfileData from "@/api/requestGetDeviceProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DeviceProfilesPage() {
  const navigate: NavigateFunction = useNavigate()

  const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
  if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }
  
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  const [profiles, setProfiles] = useState<CurrentProfileData[]>([])
  useEffect(() => {
    const updateStateProfiles = async () => {
      const publicProfiles: CurrentProfileData[] = await requestGetDeviceProfileData()
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

  const handleAddProfileClick = () => { navigate("/device/profile/register") }

  return (
    <div ref={pageRef} className={localStyles.page} style={variableStyles}>
      <div className={localStyles.header}>
        <input type="button" onClick={handleAddProfileClick} value="Add Profile" />
      </div>
      <div ref={listContainerRef} className={localStyles.main}>
        <CardList cardListStyles={cardListStyles} cardObjects={cards} />
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
