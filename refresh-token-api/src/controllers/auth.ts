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

type ReqWithRefreshToken = RequestWithBody<{ refreshToken: string }>
type ReqWithUser = RequestWithBody<IUser>

class AuthController {
  public signup = errorHandler(
    withTransactions(
      async (req: ReqWithUser, _res: Response, session: ClientSession) => {
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
      async (req: ReqWithUser, res: Response, session: ClientSession) => {
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

  public logout = errorHandler(
    withTransactions(
      async (
        req: ReqWithRefreshToken,
        res: Response,
        session: ClientSession,
      ) => {
        const refreshToken = await validateRefreshToken(req.body.refreshToken)
        await RefreshTokenModel.deleteOne(
          { _id: refreshToken.tokenId },
          { session },
        )

        return {
          success: true,
        }
      },
    ),
  )
  public logoutAll = errorHandler(
    withTransactions(
      async (
        req: ReqWithRefreshToken,
        res: Response,
        session: ClientSession,
      ) => {
        const refreshToken = await validateRefreshToken(req.body.refreshToken)
        await RefreshTokenModel.deleteMany(
          { owner: refreshToken.userId },
          { session },
        )

        return {
          success: true,
        }
      },
    ),
  )

  public newRefreshToken = errorHandler(
    withTransactions(async function (
      req: ReqWithRefreshToken,
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

  public newAccessToken = errorHandler(
    async (req: ReqWithRefreshToken, res: Response) => {
      const refreshToken = await validateRefreshToken(req.body.refreshToken)
      const accessToken = createAccessToken(refreshToken.userId)

      return {
        id: refreshToken.userId,
        refreshToken: req.body.refreshToken,
        accessToken,
      }
    },
  )
}

export default new AuthController()
