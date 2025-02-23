////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import cors from "cors"
import http from "http"
import express, { Request, Response, NextFunction } from "express"
import cookieParser from "cookie-parser"

import serverConfig from "@/config/env"
import logger from "@/library/logger"
import loggingHandler from "@/middleware/loggingHandler"
import routeNotFound from "@/middleware/routeNotFound"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Route Handlers
import handleEnsureDeviceToken from "@/api/handleEnsureDeviceToken"
import handleGetDeviceProfileData from "@/api/handleGetCurrentDeviceProfilesData"
import handleAddProfile from "@/api/handleAddProfile"

import handleCreateAccount from "@/api/handleCreateAccount"
import handleSignInAccount from "@/api/handleSignInAccount"
import handleGetCurrentAccountData from "@/api/handleGetCurrentAccountData"

import handleCreateProfile from "@/api/handleCreateProfile"
import handleSignInProfile from "@/api/handleSignInProfile"
import handleGetCurrentProfileData from "@/api/handleGetCurrentProfileData"

import handleGetAccountProfilesData from "@/api/handleGetAccountProfilesData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TEMPORARY IMPORTS
import prisma from "@/config/db"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Main = () => {
  try {
    // Start Logs
    logger.start()

    logger.attempt("Initializing API")

    // Some Middleware
    application.use(cors({
      origin: [serverConfig.client.ORIGIN],
      credentials: true
    }))
    application.use(express.urlencoded({ extended: true }))
    application.use(express.json())
    application.use(cookieParser())
    application.use(loggingHandler)

    // Define Routes
    application.get("/api/hello", (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json({ message: "hello world" })
    })
    application.post("/api/device/ensure", async (request: Request, response: Response, next: NextFunction) => {
      await handleEnsureDeviceToken(request, response)
    })
    application.get("/api/device/profiles", async (request: Request, response: Response, next: NextFunction) => {
      await handleGetDeviceProfileData(request, response)
    })
    application.post("/api/device/profiles/register", async (request: Request, response: Response, next: NextFunction) => {
      await handleAddProfile(request, response)
    })
    application.post("/api/accounts/register", async (request: Request, response: Response, next: NextFunction) => {
      await handleCreateAccount(request, response)
    })
    application.post("/api/accounts/login", async (request: Request, response: Response, next: NextFunction) => {
      await handleSignInAccount(request, response)
    })
    application.post("/api/accounts/current", async (request: Request, response: Response, next: NextFunction) => {
      await handleGetCurrentAccountData(request, response)
    })
    application.post("/api/profiles/register", async (request: Request, response: Response, next: NextFunction) => {
      await handleCreateProfile(request, response)
    })
    application.post("/api/profiles/login", async (request: Request, response: Response, next: NextFunction) => {
      await handleSignInProfile(request, response)
    })
    application.post("/api/profiles/current", async (request: Request, response: Response, next: NextFunction) => {
      await handleGetCurrentProfileData(request, response)
    })
    application.get("/api/current/account/profiles", async (request: Request, response: Response, next: NextFunction) => {
      await handleGetAccountProfilesData(request, response)
    })
    // Route Not Found
    application.use(routeNotFound)

    logger.success("Successfully Initialized API")
    logger.line()

    // Start Server
    const port = 3000
    logger.attempt("Starting Server")
    httpServer = http.createServer(application)
    httpServer.listen(port, () => {
      logger.success("Successfully Started Server")
      logger.line()
      logger.message(`Server Running on Port ${port}`)
      logger.line()
    })
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Server Error")
    logger.error(error)
    logger.trace(error)
    console.log(error)
    shutdown()
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shutdown = (callback?: any) => {
  if (httpServer) {
    logger.attempt("Attempting to Close Server")
    httpServer.close(callback)
    logger.success("Successfully Closed Server")
    logger.line()
    logger.end()
    process.exit(0)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Main()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
