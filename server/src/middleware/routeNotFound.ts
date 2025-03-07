////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response, NextFunction } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const message: string = "Route Not Found"
  logger.failure(message)
  res.status(404).json({ message })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
