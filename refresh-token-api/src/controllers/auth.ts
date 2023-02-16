import { Response, Request } from 'express'
import { ClientSession } from 'mongoose'
import argon2 from 'argon2'

import { RequestWithBody } from '../@types/express'
import { IUser } from '../models/User'
import { RefreshTokenModel, UserModel } from '../models'
import {
  createAccessToken,
  createRefreshToken,
  validateRefreshToken,
  verifyPassword,
} from '../utils/token'
import { HttpError, errorHandler } from '../utils/error'
import { withTransactions } from '../utils/transactions'

class AuthController {
  public signup = errorHandler(
    withTransactions(
      async (
        req: RequestWithBody<IUser>,
        _res: Response,
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

        return {
          accessToken,
          refreshToken,
          id: userInstance._id,
          user: userInstance,
        }
      },
    ),
  )

  public login = errorHandler(
    withTransactions(
      async (
        req: RequestWithBody<IUser>,
        res: Response,
        session: ClientSession,
      ) => {
        const { password, username } = req.body

        const userInstance = await UserModel.findOne({
          username,
        })
          .select('password')
          .exec()

        if (!userInstance)
          throw new HttpError(401, 'Wrong username or password')

        await verifyPassword(userInstance.password, password)

        const refreshTokenInstance = new RefreshTokenModel({
          owner: userInstance._id,
        })

        await refreshTokenInstance.save({ session })

        const refreshToken = createRefreshToken(
          userInstance._id,
          refreshTokenInstance._id,
        )
        const accessToken = createAccessToken(userInstance._id)

        return {
          accessToken,
          refreshToken,
          id: userInstance._id,
        }
      },
    ),
  )
  public newRefreshToken = errorHandler(
    withTransactions(async function (
      req: RequestWithBody<{ refreshToken: string }>,
      res: Response,
      session: ClientSession,
    ) {
      const currentRefreshToken = await validateRefreshToken(
        req.body.refreshToken,
      )
      const userId = currentRefreshToken.userId

      const refreshTokenInstance = new RefreshTokenModel({
        owner: userId,
      })

      await refreshTokenInstance.save({ session })
      await RefreshTokenModel.deleteOne(
        { _id: currentRefreshToken.tokenId },
        { session },
      )

      const refreshToken = createRefreshToken(userId, refreshTokenInstance._id)
      const accessToken = createAccessToken(userId)

      return {
        id: userId,
        accessToken,
        refreshToken,
      }
    }),
  )
}

export default new AuthController()
