import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import { RequestWithBody } from '../@types/express'
import { IUser } from '../models/User'
import { Response } from 'express'
import { RefreshTokenModel, UserModel } from '../models'
import argon2 from 'argon2'
import { createAccessToken, createRefreshToken } from '../utils/token'
import { HttpError, errorHandler } from '../utils/error'

class AuthController {
  public signUp = errorHandler(
    async (req: RequestWithBody<IUser>, res: Response) => {
      const { password, username } = req.body

      if (!password || !username)
        throw new HttpError(400, 'Missing user information')
      const userInstance = new UserModel({
        username,
        password: await argon2.hash(password),
      })

      const refreshTokenInstance = new RefreshTokenModel({
        owner: userInstance._id,
      })

      await userInstance.save()
      await refreshTokenInstance.save()

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
  )
}

export default new AuthController()
