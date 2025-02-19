////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { VariableStyles } from "@/utils/styles"
import { calculateItemBorderWidth } from "@/components/temp/calculateDimensions"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type PublicProfile = {
  name: string
  username: string
}
import { ProfileCard } from "@/components/temp/profile-card"

/*
import { PublicSong } from "shared/types/data/song"
import { SongCard } from "./cards/song-card"
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CardObject = {
  type: string,
  data: Record<string, unknown>
}

export type CardStyles = {
  cardWidth: number,
  cardHeight: number
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const processCardStyles = (cardStyles: CardStyles): VariableStyles => {
  const { cardWidth, cardHeight } = cardStyles
  const cardBorderWidth: number = calculateItemBorderWidth(cardWidth, cardHeight)
  const variableStyles: VariableStyles = {
    "--cardWidth": `${cardWidth}px`,
    "--cardHeight": `${cardHeight}px`,
    "--cardBorderWidth": `${cardBorderWidth}px`
  }
  return variableStyles
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CardProps = {
  cardObject: CardObject,
  cardStyles: CardStyles
}

export const Card = ({ cardObject, cardStyles }: CardProps) => {
  try {
    switch (cardObject.type) {
      case "profile": return <ProfileCard profile={cardObject.data as PublicProfile} cardStyles={cardStyles} />
      default: throw new Error("Invalid Card Type")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Card")
    console.log(error)
    return null
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
