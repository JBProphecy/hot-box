////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./card-list.module.css"
import { VariableStyles } from "@/app/utils/styles/types/VariableStyles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Card, CardObject, CardStyles } from "./card"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type Dimensions = {
  width: number,
  height: number
}

export type CardListStyles = {
  containerDimensions: Dimensions,
  space: number
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const processCardListStyles = (cardListStyles: CardListStyles) => {
  const { containerDimensions, space } = cardListStyles
  const { width: containerWidth, height: containerHeight } = containerDimensions
  const cardHeight: number = calculateCardHeight(containerWidth, containerHeight)
  const cardStyles: CardStyles = {
    cardWidth: containerWidth,
    cardHeight: cardHeight
  }
  const variableStyles: VariableStyles = {
    "--cardListSpace": `${space}px`
  }
  return { cardStyles, variableStyles }
}

const getKeySize = (listContainerWidth: number, listContainerHeight: number, targetRatio: number) => {
  const currentRatio: number = listContainerWidth / listContainerHeight
  if (currentRatio < targetRatio) { return listContainerWidth }
  else { return listContainerHeight * targetRatio }
}

const calculateCardHeight = (containerWidth: number, containerHeight: number): number => {
  const targetContainerRatio: number = 9/16
  const targetCardRatio: number = 4
  const keySize: number = getKeySize(containerWidth, containerHeight, targetContainerRatio)
  return keySize / targetCardRatio
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CardListProps = {
  cardObjects: CardObject[],
  cardListStyles: CardListStyles,
}

export const CardList = ({ cardObjects, cardListStyles }: CardListProps) => {
  try {
    // Variable Styles
    const { cardStyles, variableStyles } = processCardListStyles(cardListStyles)

    // HTML Content
    return (
      <ul className={localStyles.cardList} style={variableStyles}>
        {cardObjects.map((cardObject, index) => (
          <li key={index} className={localStyles.cardListItem}>
            <Card cardObject={cardObject} cardStyles={cardStyles} />
          </li>
        ))}
      </ul>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Card List")
    console.log(error)
    return null
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
