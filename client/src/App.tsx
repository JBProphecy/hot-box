////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Navigate, RouterProvider, Route } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Providers

import CurrentAccountProvider from "@/app/context/CurrentAccountProvider"
import CurrentProfileProvider from "@/app/context/CurrentProfileProvider"
import SpotifyProvider from "@/app/context/SpotifyProvider"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Layouts

import RootLayout from "@/app/layouts/RootLayout"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Pages

import DevPage from "@/app/test/DevPage"

import requestEnsureDeviceToken from "./api/requestEnsureDeviceToken"

import CurrentAccountPage from "@/app/pages/CurrentAccountPage"
import CreateAccountPage from "@/app/pages/CreateAccountPage"

import DeviceProfilesPage from "@/app/temp/pages/DeviceProfilesPage"
import AddProfilePage from "@/app/pages/AddProfilePage"

import CurrentProfilePage from "@/app/pages/CurrentProfilePage"
import CreateProfilePage from "@/app/pages/CreateProfilePage"

import Visualizer from "@/app/pages/02/Visualizer"
import SpotifyPage from "@/app/pages/02/SpotifyPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Router

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="test" element={<DevPage />} />
      <Route path="music" element={<Visualizer />} />
      <Route path="spotify" element={<SpotifyPage />} />
      <Route path="accounts">
        <Route index element={<Navigate to={"current-account"} />} />
        <Route path="create-account" element={<CreateAccountPage />} />
        <Route path="current-account">
          <Route index element={<CurrentAccountPage />} />
          <Route path="create-profile" element={<CreateProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/accounts/current-account" />} />
      </Route>
      <Route path="profiles">
        <Route index element={<DeviceProfilesPage />} />
        <Route path="add-profile" element={<AddProfilePage />} />
        <Route path="current-profile">
          <Route index element={<CurrentProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/profiles" />} />
      </Route>
    </Route>
  )
)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  useEffect(() => { requestEnsureDeviceToken() }, [])

  try {
    return (
      <CurrentAccountProvider>
        <CurrentProfileProvider>
          <SpotifyProvider>
            <RouterProvider router={router} />
          </SpotifyProvider>
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
