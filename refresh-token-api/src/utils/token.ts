import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import argon2 from 'argon2'
import { HttpError } from './error'

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

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_TOKEN_SECRET)
  } catch (e) {
    throw new HttpError(401, 'Unauthorized')
  }
}
