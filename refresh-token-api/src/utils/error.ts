import { NextFunction, Request, Response } from 'express'
import logger from './logger'

type fn = (req: Request, res: Response) => Promise<any>

export const errorHandler = (fn: fn) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const result = await fn(req, res)
      res.json(result)
    } catch (e) {
      next(e)
    }
  }
}

export const customErrorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error)
  res.status(error.statusCode || 500).send({ error: error.message })
}

export class HttpError extends Error {
  public statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}
