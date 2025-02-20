////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Providers

import CurrentAccountProvider from "@/context/CurrentAccountProvider"
import CurrentProfileProvider from "@/context/CurrentProfileProvider"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FullScreenLayout from "@/app/FullScreenLayout"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import requestEnsureDeviceToken from "./api/requestEnsureDeviceToken"

import CreateAccountPage from "@/app/CreateAccountPage"
import SignInAccountPage from "@/app/SignInAccountPage"
import CurrentAccountPage from "@/app/CurrentAccountPage"

import DeviceProfilesPage from "@/app/DeviceProfilesPage"
import AddProfilePage from "@/app/AddProfilePage"
import SignInProfilePage from "@/app/SignInProfilePage"
import CurrentProfilePage from "@/app/CurrentProfilePage"

// create profile page

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  useEffect(() => {
    const sendRequests = async () => {
      await requestEnsureDeviceToken()
    }
    sendRequests()
  }, [])
  try {
    return (
      <CurrentAccountProvider>
        <CurrentProfileProvider>
          <FullScreenLayout>
            <Router>
              <Routes>
                <Route path="/device/profiles" element={<DeviceProfilesPage />} />
                <Route path="/device/profile/register" element={<AddProfilePage />} />
                <Route path="/current/profile" element={<CurrentProfilePage />} />
                <Route path="/current/account" element={<CurrentAccountPage />} />
                <Route path="/account/register" element={<CreateAccountPage />} />
                <Route path="/account/login" element={<SignInAccountPage />} />
                <Route path="/profile/login" element={<SignInProfilePage />} />
              </Routes>
            </Router>
          </FullScreenLayout>
        </CurrentProfileProvider>
      </CurrentAccountProvider>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("App Error")
    console.log(error)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
