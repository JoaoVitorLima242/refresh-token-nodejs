import * as dotenv from 'dotenv'

dotenv.config()

export const config: {
  PORT: number
  MONGO_URI: string
  AWS_ACCESS_ID: string
  AWS_SECRET_ACCESS: string
  AWS_BUCKET_NAME: string
  AWS_BUCKET_REGION: string
  JWT_ACCESS_TOKEN_SECRET: string
  JWT_REFRESH_TOKEN_SECRET: string
} = {
  PORT: Number(process.env.PORT) || 8080,
  MONGO_URI: process.env.MONGO_URI || '',
  AWS_ACCESS_ID: process.env.AWS_ACCESS_KEY || '',
  AWS_SECRET_ACCESS: process.env.AWS_SECRET_KEY || '',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION || '',
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || '',
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || '',
}
