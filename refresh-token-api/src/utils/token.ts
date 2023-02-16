import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import argon2 from 'argon2'
import { HttpError } from './error'
import { RefreshTokenModel } from '../models'
import { NextFunction, Request, Response } from 'express'

export type AccessTokenObj = {
  userId: string
}
export type RefreshTokenObj = {
  userId: string
  tokenId: string
}

export const createAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    config.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: '10m' },
  )
}

export const createRefreshToken = (userId: string, refreshTokenId: string) => {
  return jwt.sign(
    {
      userId,
      tokenId: refreshTokenId,
    },
    config.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' },
  )
}

export const verifyPassword = async (
  hasedPassword: string,
  rawPassword: string,
) => {
  const passwordMatched = await argon2.verify(hasedPassword, rawPassword)

  if (!passwordMatched) {
    throw new HttpError(401, 'Wrong username or password')
  }
}

export const validateRefreshToken = async (token: string) => {
  const decodeToken = () => {
    try {
      return jwt.verify(
        token,
        config.JWT_REFRESH_TOKEN_SECRET,
      ) as RefreshTokenObj
    } catch (e) {
      throw new HttpError(401, 'Unauthorized')
    }
  }

  const decodedToken = decodeToken()
  const tokenExists = await RefreshTokenModel.exists({
    _id: decodedToken.tokenId,
  })

  if (tokenExists) {
    return decodedToken
  } else {
    throw new HttpError(401, 'Unauthorized')
  }
}

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new HttpError(401, 'Unauthorized')
  }

  try {
    const decodedToken = jwt.verify(
      token,
      config.JWT_ACCESS_TOKEN_SECRET,
    ) as AccessTokenObj
    req.userId = decodedToken.userId

    next()
  } catch (e) {
    throw new HttpError(401, 'Unauthorized')
  }
}
