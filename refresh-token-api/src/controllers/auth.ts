import { Response } from 'express'
import { ClientSession } from 'mongoose'

import { RequestWithBody } from '../@types/express'
import { IUser } from '../models/User'
import { RefreshTokenModel, UserModel } from '../models'
import argon2 from 'argon2'
import { createAccessToken, createRefreshToken } from '../utils/token'
import { HttpError, errorHandler } from '../utils/error'
import { withTransactions } from '../utils/transactions'

class AuthController {
  public signUp = errorHandler(
    withTransactions(
      async (
        req: RequestWithBody<IUser>,
        res: Response,
        session: ClientSession,
      ) => {
        const { password, username } = req.body

        if (!password || !username)
          throw new HttpError(400, 'Missing information')
        const userInstance = new UserModel({
          username,
          password: await argon2.hash(password),
        })

        const refreshTokenInstance = new RefreshTokenModel({
          owner: userInstance._id,
        })

        await userInstance.save({ session })
        await refreshTokenInstance.save({ session })

        const refreshToken = createRefreshToken(
          userInstance._id,
          refreshTokenInstance._id,
        )
        const accessToken = createAccessToken(userInstance._id)

        throw new HttpError(400, 'forced Error')

        return {
          accessToken,
          refreshToken,
          id: userInstance._id,
          user: userInstance,
        }
      },
    ),
  )
}

export default new AuthController()
