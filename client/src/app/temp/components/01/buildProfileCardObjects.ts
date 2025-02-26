////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CardObject } from "./card"

type PublicProfile = {
  name: string
  username: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const buildProfileCardObject = (profile: PublicProfile): CardObject => {
  const cardObject: CardObject = {
    type: "profile",
    data: profile
  }
  return cardObject
}

export const buildProfileCardObjects = (profiles: PublicProfile[]): CardObject[] => {
  let cardObjects: CardObject[] = []
  for (const profile of profiles) {
    const cardObject: CardObject = buildProfileCardObject(profile)
    cardObjects.push(cardObject)
  }
  return cardObjects
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
