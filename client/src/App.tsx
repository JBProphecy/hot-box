////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Navigate, RouterProvider, Route } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Providers

import CurrentAccountProvider from "@/context/CurrentAccountProvider"
import CurrentProfileProvider from "@/context/CurrentProfileProvider"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Layouts

import RootLayout from "@/app/layouts/RootLayout"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Pages

import DevPage from "@/app/test/DevPage"

import requestEnsureDeviceToken from "./api/requestEnsureDeviceToken"

import CurrentAccountPage from "@/app/pages/CurrentAccountPage"
import CreateAccountPage from "@/app/pages/CreateAccountPage"

import DeviceProfilesPage from "@/app/DeviceProfilesPage"
import AddProfilePage from "@/app/AddProfilePage"

import CurrentProfilePage from "@/app/CurrentProfilePage"
import CreateProfilePage from "@/app/CreateProfilePage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Router

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="test" element={<DevPage />} />
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
          <RouterProvider router={router} />
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
