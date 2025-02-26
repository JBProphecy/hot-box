////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param size - a size in pixels (height)
 * @param scale - a scale factor (1/24)
 * @returns the border radius as an integer
 */
export default function calcBorderRadiusPx(size: number, scale: number) {
  return Math.floor(scale * size)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
