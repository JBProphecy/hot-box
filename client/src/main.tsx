////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./styles/globals.css"
import App from "./App"

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
catch (object: unknown) {
  const error = object as Error
  console.error("Main Error")
  console.log(error)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
