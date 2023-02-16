import { NextFunction, Request, Response } from 'express'
import mongoose, { ClientSession } from 'mongoose'

type fn = (req: Request, res: Response, session?: ClientSession) => Promise<any>

export const withTransactions = (fn: any) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    let result
    await mongoose.connection.transaction(async session => {
      result = await fn(req, res, session)
      return result
    })

    return result
  }
}
