////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param x0 - x-coordinate of the start point.
 * @param x1 - x-coordinate of the first control point.
 * @param x2 - x-coordinate of the second control point.
 * @param x3 - x-coordinate of the end point.
 * @param y0 - y-coordinate of the start point.
 * @param y1 - y-coordinate of the first control point.
 * @param y2 - y-coordinate of the second control point.
 * @param y3 - y-coordinate of the end point.
 */
export type BezierCurveProps = {
  x0: number
  x1: number
  x2: number
  x3: number
  y0: number
  y1: number
  y2: number
  y3: number
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param props - see documentation for BezierCurveProps
 * @returns some functions for using the Bezier Curve
 */
export default function useBezierCurve(props: BezierCurveProps) {

  /**
   * calculates the x-coordinate of a bezier curve given t
   * @param t - a value ranging from 0 to 1
   * @returns the x-coordinate
   */
  const getX = (t: number) => {
    const { x0, x1, x2, x3 } = props
    const u: number = 1 - t
    return (x0 * u ** 3) + (3 * x1 * u ** 2 * t) + (3 * x2 * u * t ** 2) + (x3 * t ** 3)
  }

  /**
   * calculates the y-coordinate of a bezier curve given t
   * @param t - a value ranging from 0 to 1
   * @returns the y-coordinate
   */
  const getY = (t: number) => {
    const { y0, y1, y2, y3 } = props
    const u: number = 1 - t
    return (y0 * u ** 3) + (3 * y1 * u ** 2 * t) + (3 * y2 * u * t ** 2) + (y3 * t ** 3)
  }

  /**
   * calculates the x and y coordinates of a bezier curve given t
   * @param t - a value ranging from 0 to 1
   * @returns a tuple containing the x and y coordinates
   */
  const getCoordinates = (t: number) => {
    const x: number = getX(t)
    const y: number = getY(t)
    return [x, y] as const
  }

  return { getX, getY, getCoordinates }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
