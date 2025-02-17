////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ansi from "@/library/ansi"
import logger from "@/library/logger"
import formatStatusCode from "@/utils/formatStatusCode"

import { Request, Response, NextFunction } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function loggingHandler(req: Request, res: Response, next: NextFunction) {
  logger.network(`Incoming - METHOD: [${ansi.styles.bold + ansi.fgc.purple + req.method + ansi.reset}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)
  res.on("finish", () => {
    logger.network(`Outgoing - METHOD: [${ansi.styles.bold + ansi.fgc.purple + req.method + ansi.reset}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${formatStatusCode(res.statusCode)}]`)
    logger.line()
  })
  next()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
