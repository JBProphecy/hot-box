////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response, NextFunction } from "express"
import ansi from "@/lib/ansi"
import logger from "@/config/logger"
import formatStatusCode from "@/utils/formatStatusCode"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function loggingHandler(req: Request, res: Response, next: NextFunction) {
  logger.network(`Incoming - METHOD: [${ansi.fgc.blue + req.method + ansi.reset}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)
  res.on("finish", () => {
    logger.network(`Outgoing - METHOD: [${ansi.fgc.blue + req.method + ansi.reset}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${formatStatusCode(res.statusCode)}]`)
    logger.line()
  })
  next()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
