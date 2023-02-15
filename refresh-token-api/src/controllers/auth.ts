import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import { RequestWithBody } from '../@types/express'
import { IUser } from '../models/User'
import { Response } from 'express'
import { RefreshTokenModel, UserModel } from '../models'
import argon2 from 'argon2'
import { createAccessToken, createRefreshToken } from '../utils/token'

class AuthController {
  public async signUp(req: RequestWithBody<IUser>, res: Response) {
    const { password, username } = req.body

    if (!password || !username)
      return res.status(400).json({ error: 'Missing information' })
    try {
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

      res.status(200).json({
        accessToken,
        refreshToken,
        id: userInstance._id,
        user: userInstance,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Sign up failed' })
    }
  }
}

export default new AuthController()
