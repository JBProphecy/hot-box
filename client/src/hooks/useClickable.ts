////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UseClickableProps = {
  element: React.RefObject<HTMLElement>,
  activeClass: string,
  action: Function
}

export default function useClickable(props: UseClickableProps) {
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false)
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)
  const [isStateLocked, setIsStateLocked] = useState<boolean>(false)

  const pressButton = () => { if (props.element.current) {
    props.element.current.classList.add(props.activeClass)
    setIsButtonPressed(true); lockState()
  }}
  const releaseButton = () => { if (props.element.current) {
    props.element.current.classList.remove(props.activeClass)
    setIsButtonPressed(false); lockState()
  }}
  const lockState = () => {
    setIsStateLocked(true)
    setTimeout(() => { setIsStateLocked(false) }, 300)
  }

  const handleMouseDown = () => {
    if (!isMousePressed) {
      setIsMousePressed(true)
      if (!isStateLocked) { pressButton() }
    }
  }
  const handleMouseUp = () => {
    setIsMousePressed(false)
    if (isButtonPressed && !isStateLocked) { releaseButton(); props.action() }
  }

  useEffect(() => {
    if (isMousePressed) {
      const timer = setTimeout(() => { releaseButton() }, 500)
      return () => { clearTimeout(timer) }
    }
  }, [isMousePressed])

  useEffect(() => {
    if (!isStateLocked && !isMousePressed && isButtonPressed) { releaseButton(); props.action() }
  }, [isStateLocked])

  return { handleMouseDown, handleMouseUp }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
