////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UseKeyableProps = {
  elementRef: React.RefObject<HTMLElement>,
  pressedClass: string,
  linkedKey: string,
  pressedAction?: () => void
  heldAction?: () => void
  timeout?: number
}

export type UseKeyableFunctions = {
  handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
  handleKeyUp: (event: React.KeyboardEvent<HTMLElement>) => void
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useKeyable(props: UseKeyableProps): UseKeyableFunctions {
  // Defaults
  const pressedAction: () => void = props.pressedAction || (() => console.log("pressed"))
  const heldAction: () => void = props.heldAction || (() => console.log("held") )
  const timeout: number = props.timeout || 500

  // States
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)
  const [isStateLocked, setIsStateLocked] = useState<boolean>(false)

  const pressButton = () => { if (props.elementRef.current) {
    props.elementRef.current.classList.add(props.pressedClass)
    setIsButtonPressed(true); lockState()
  }}
  const releaseButton = () => { if (props.elementRef.current) {
    props.elementRef.current.classList.remove(props.pressedClass)
    setIsButtonPressed(false); lockState()
  }}
  const lockState = () => {
    setIsStateLocked(true)
    setTimeout(() => { setIsStateLocked(false) }, 250)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === props.linkedKey && !isKeyPressed) {
      setIsKeyPressed(true)
      if (!isStateLocked) { pressButton() }
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === props.linkedKey) {
      setIsKeyPressed(false)
      if (isButtonPressed && !isStateLocked) {
        releaseButton()
        pressedAction() }
    }
  }

  useEffect(() => {
    if (isKeyPressed) {
      const timer = setTimeout(() => {
        releaseButton()
        heldAction()
      }, timeout)
      return () => { clearTimeout(timer) }
    }
  }, [isKeyPressed])

  useEffect(() => {
    if (!isStateLocked && !isKeyPressed && isButtonPressed) {
      releaseButton()
      pressedAction() }
  }, [isStateLocked])

  return { handleKeyDown, handleKeyUp } as UseKeyableFunctions
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
