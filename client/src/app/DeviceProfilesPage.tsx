////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./DeviceProfilesPage.module.css"
import useDimensions, { Dimensions, zeroDimensions } from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Context

import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Components

import { CardList, CardListStyles } from "@/components/temp/card-list"
import { CardObject } from "@/components/temp/card"

import { CurrentDeviceProfileData } from "shared/types/data/private/CurrentDeviceProfileData"
import requestGetDeviceProfileData, { GetCurrentDeviceProfilesDataResult } from "@/api/requestGetCurrentDeviceProfilesData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DeviceProfilesPage() {

  // Navigation
  const navigate: NavigateFunction = useNavigate()

  // Current Profile
  const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
  if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }
  
  // Page Reference
  const pageRef = useRef<HTMLDivElement>(null)
  const pageDimensions: Dimensions = useDimensions(pageRef)
  useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])

  // List Container
  const listContainerRef = useRef<HTMLDivElement>(null)
  const [listContainerDimensions, setListContainerDimensions] = useState<Dimensions>(zeroDimensions)
  const updateListContainerDimensions = () => {
    if (listContainerRef.current === null) { setListContainerDimensions(zeroDimensions); return }
    setListContainerDimensions({
      width: listContainerRef.current.offsetWidth,
      height: listContainerRef.current.offsetHeight
    })
  }
  useEffect(() => { updateListContainerDimensions() }, [pageDimensions])

  // Profiles
  const [profiles, setProfiles] = useState<CurrentDeviceProfileData[]>([])
  const updateProfiles = async () => {
    const result: GetCurrentDeviceProfilesDataResult = await requestGetDeviceProfileData()
    if (!result.success) { setProfiles([]); return }
    setProfiles(result.data)
  }
  useEffect(() => { updateProfiles() }, [])

  // Cards
  const [cards, setCards] = useState<CardObject[]>([])
  const updateCards = () => {
    const cardObjects: CardObject[] = []
    for (const profile of profiles) {
      const cardObject: CardObject = {
        type: "profile",
        data: profile
      }
      cardObjects.push(cardObject)
    }
    setCards(cardObjects)
  }
  useEffect(() => { updateCards() }, [profiles])

  // Variable Styles
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageDimensions.width),
    "--pageHeight": toPixelString(pageDimensions.height)
  }

  // Card List Styles
  const [cardListStyles, setCardListStyles] = useState<CardListStyles>({
    containerDimensions: zeroDimensions, space: 10
  })
  const updateCardListStyles = () => {
    setCardListStyles({
      containerDimensions: {
        width: listContainerDimensions.width,
        height: listContainerDimensions.height
      },
      space: 10
    })
  }
  useEffect(() => { updateCardListStyles() }, [listContainerDimensions])

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
