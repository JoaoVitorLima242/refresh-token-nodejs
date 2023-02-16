import jwt from 'jsonwebtoken'
import { config } from '../config/vars'
import argon2 from 'argon2'
import { HttpError } from './error'
import logger from './logger'

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

  if (passwordMatched) {
    logger.info('password match')
  } else {
    throw new HttpError(401, 'Wrong username or password')
  }
}
