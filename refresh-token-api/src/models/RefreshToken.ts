import { Schema, model } from 'mongoose'

interface IRefreshToken {
  owner: string
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema)
