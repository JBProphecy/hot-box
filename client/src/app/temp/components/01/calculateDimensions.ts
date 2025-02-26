////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getSmallerNumber = (n1: number, n2: number): number => {
  if (n1 < n2) { return n1 }
  else { return n2 }
}

const getKeySize = (currentWidth: number, currentHeight: number, targetAspectRatio: number) => {
  const currentAspectRatio: number = currentWidth / currentHeight
  if (currentAspectRatio < targetAspectRatio) { return currentWidth }
  else { return currentHeight * targetAspectRatio }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const calculateScreenPadding = (currentWidth: number, currentHeight: number): number => {
  const targetAspectRatio: number = 9/16
  const keySize: number = getKeySize(currentWidth, currentHeight, targetAspectRatio)
  let screenPadding: number = Math.floor(keySize / 48)
  if (screenPadding < 4) { screenPadding = 4 }
  return screenPadding
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const calculateDimensions = (screenWidth: number, screenHeight: number) => {
  const screenPadding: number = calculateScreenPadding(screenWidth, screenHeight)
  const contentWidth: number = screenWidth - (2 * screenPadding)
  const contentHeight: number = screenHeight - (2 * screenPadding)
  return { screenPadding, contentWidth, contentHeight }
}

export const calculateFullWidthItemHeight = (currentWidth: number, currentHeight: number): number => {
  const targetAspectRatio: number = 9/16
  const itemAspectRatio: number = 9/2
  const keySize: number = getKeySize(currentWidth, currentHeight, targetAspectRatio)
  return keySize / itemAspectRatio
}

export const calculateItemBorderWidth = (itemWidth: number, itemHeight: number) => {
  const smallSide: number = getSmallerNumber(itemWidth, itemHeight)
  let itemBorderWidth: number = Math.floor(smallSide / 24)
  if (itemBorderWidth < 2) { itemBorderWidth = 2 }
  return itemBorderWidth
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
