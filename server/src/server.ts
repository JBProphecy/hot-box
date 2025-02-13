////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import cors from "cors"
import http from "http"
import express, { Request, Response, NextFunction } from "express"
import cookieParser from "cookie-parser"

import serverConfig from "@/config/env"
import logger from "@/config/logger"
import loggingHandler from "@/middleware/loggingHandler"
import routeNotFound from "@/middleware/routeNotFound"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TEMPORARY IMPORTS
import runTests from "@/test/test"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Main = () => {
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
    logger.info(`Server Running on Port ${port}`)
    logger.line()
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shutdown = (callback?: any) => {
  if (httpServer) {
    logger.end()
    httpServer.close(callback)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Main()
//runTests()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
