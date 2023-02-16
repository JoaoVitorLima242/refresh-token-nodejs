import { Request, Response } from 'express'
import { UserModel } from '../models'
import { HttpError, errorHandler } from '../utils/error'

class UsersControllers {
  public me = errorHandler(async (req: Request, _res: Response) => {
    const userInstance = await UserModel.findById(req.userId).exec()
    if (!userInstance) throw new HttpError(401, 'User not found')

    return userInstance
  })
}

export default new UsersControllers()
