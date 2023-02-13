import { Schema, model } from 'mongoose'

export interface IUser {
  username: string
  password: string
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model<IUser>('User', userSchema)
