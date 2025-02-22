////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Providers

import CurrentAccountProvider from "@/context/CurrentAccountProvider"
import CurrentProfileProvider from "@/context/CurrentProfileProvider"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FullScreenLayout from "@/app/FullScreenLayout"
import AppLayout from "@/app/AppLayout"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import requestEnsureDeviceToken from "./api/requestEnsureDeviceToken"

import DeviceProfilesPage from "@/app/DeviceProfilesPage"
import AddProfilePage from "@/app/AddProfilePage"

import CreateAccountPage from "@/app/CreateAccountPage"
import SignInAccountPage from "@/app/SignInAccountPage"
import CurrentAccountPage from "@/app/CurrentAccountPage"

import CreateProfilePage from "@/app/CreateProfilePage"
import SignInProfilePage from "@/app/SignInProfilePage"
import CurrentProfilePage from "@/app/CurrentProfilePage"

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
          <Router>
            <FullScreenLayout>
              <AppLayout>
                <Routes>
                  <Route path="/device/profiles" element={<DeviceProfilesPage />} />
                  <Route path="/device/profiles/register" element={<AddProfilePage />} />

                  <Route path="/accounts/register" element={<CreateAccountPage />} />
                  <Route path="/accounts/login" element={<SignInAccountPage />} />
                  <Route path="/accounts/current" element={<CurrentAccountPage />} />
                  
                  <Route path="/profiles/register" element={<CreateProfilePage />} />
                  <Route path="/profiles/login" element={<SignInProfilePage />} />
                  <Route path="/profiles/current" element={<CurrentProfilePage />} />
                </Routes>
              </AppLayout>
            </FullScreenLayout>
          </Router>
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
