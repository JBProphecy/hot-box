////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

import localStyles from "./SignInProfilePage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"

import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"

import { SignInProfileRawBody } from "shared/api/SignInProfileTypes"
import requestSignInProfile from "@/api/requestSignInProfile"


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInProfilePage() {
  const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
  if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }
  
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  const navigate: NavigateFunction = useNavigate()

  const [formData, setFormData] = useState<SignInProfileRawBody>({
    username: "",
    password: ""
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const validateFormData = (data: SignInProfileRawBody): boolean => {
    const { username, password } = data
    if (typeof username === "undefined") {
      console.warn("Username is Required")
      return false
    }
    if (typeof password === "undefined") {
      console.warn("Password is Required")
      return false
    }
    return true
  }

  const handleSignInProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValidFormData: boolean = validateFormData(formData)
    if (!isValidFormData) { return }

    const profileID: string | null = await requestSignInProfile(formData)
    if (!profileID) { return }
    currentProfile.setID(profileID)

    navigate("/current/profile")
  }

  try {
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <form onSubmit={handleSignInProfile}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input type="submit" value="Submit" />
            <input type="button" value="Go Back" />
          </div>
        </form>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Create Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
