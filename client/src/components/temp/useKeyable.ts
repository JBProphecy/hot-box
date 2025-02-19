////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UseKeyableProps = {
  element: React.RefObject<HTMLDivElement>,
  activeClass: string,
  key: string,
  action: () => void
}

export function useKeyable(props: UseKeyableProps) {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)
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
    setTimeout(() => { setIsStateLocked(false) }, 200)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === props.key && !isKeyPressed) {
      setIsKeyPressed(true)
      if (!isStateLocked) { pressButton() }
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === props.key) {
      setIsKeyPressed(false)
      if (isButtonPressed && !isStateLocked) { releaseButton(); props.action() }
    }
  }

  useEffect(() => {
    if (isKeyPressed) {
      const timer = setTimeout(() => { releaseButton() }, 500)
      return () => { clearTimeout(timer) }
    }
  }, [isKeyPressed])

  useEffect(() => {
    if (!isStateLocked && !isKeyPressed && isButtonPressed) { releaseButton(); props.action() }
  }, [isStateLocked])

  return { handleKeyDown, handleKeyUp }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
