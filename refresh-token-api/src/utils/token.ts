import jwt from 'jsonwebtoken'
import { config } from '../config/vars'

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
