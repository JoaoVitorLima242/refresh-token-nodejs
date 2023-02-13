import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import { RequestWithBody } from '../@types/express'
import { IUser } from '../models/User'
import { Response } from 'express'
import { RefreshTokenModel, UserModel } from '../models'
import argon2 from 'argon2'

class AuthController {
  public async signUp(req: RequestWithBody<IUser>, res: Response) {
    const { password, username } = req.body

    const userInstance = new UserModel({
      username,
      password: await argon2.hash(password),
    })

    const refreshTokenInstance = new RefreshTokenModel({
      owner: userInstance._id,
    })

    const refreshToken = this.createRefreshToken(
      userInstance._id,
      refreshTokenInstance._id,
    )
    const accessToken = this.createAccessToken(userInstance._id)

    res.status(200).json({
      accessToken,
      refreshToken,
      id: userInstance._id,
    })
  }
  public createAccessToken(userId: string) {
    return jwt.sign(
      {
        userId,
      },
      config.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' },
    )
  }
  public createRefreshToken(userId: string, refreshTokenId: string) {
    return jwt.sign(
      {
        userId,
        tokenId: refreshTokenId,
      },
      config.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' },
    )
  }
}

export default new AuthController()
