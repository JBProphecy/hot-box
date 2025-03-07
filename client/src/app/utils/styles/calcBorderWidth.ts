////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param size - a size in pixels (height)
 * @param scale - a scale factor to be multiplied (1/24)
 * @param fixed - a size in pixels to be added (2)
 * @returns the border width as an integer
 */
export default function calcBorderWidthPx(size: number, scale: number, fixed: number) {
  return Math.floor(scale * size + fixed)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
