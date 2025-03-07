////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/config/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./DeviceProfilesPage.module.css"
import useDimensions, { Dimensions, zeroDimensions } from "@/app/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Context

import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Components

import { CardList, CardListStyles } from "@/app/temp/components/01/card-list"
import { CardObject } from "@/app/temp/components/01/card"

import { CurrentDeviceProfileData } from "shared/types/data/private/CurrentDeviceProfileData"
import requestGetDeviceProfileData, { GetCurrentDeviceProfilesDataResult } from "@/api/requestGetCurrentDeviceProfilesData"

import FancyButton, { FancyButtonSizeProps } from "@/app/components/FancyButton"
import threeColorSets from "@/app/library/threeColorSets"

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

  const handleAddProfileClick = () => { navigate(routes.addProfilePage) }

  const fancyButtonSizeProps: FancyButtonSizeProps = {
    width: { type: "intrinsic" },
    height: { type: "relative", percent: 70 }
  }

  return (
    <div ref={pageRef} className={localStyles.page} style={variableStyles}>
      <div className={localStyles.header}>
        <span>Your Profiles</span>
        <FancyButton
          {...fancyButtonSizeProps}
          contentType="text"
          contentValue="Add Profile"
          activeColors={threeColorSets.set04}
          pressedAction={handleAddProfileClick}
        />
      </div>
      <div ref={listContainerRef} className={localStyles.main}>
        <CardList cardListStyles={cardListStyles} cardObjects={cards} />
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
