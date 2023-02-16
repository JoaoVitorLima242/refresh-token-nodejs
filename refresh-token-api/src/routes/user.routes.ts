import { Router } from 'express'
import UsersController from '../controllers/users'
import { verifyAccessToken } from '../utils/token'

const routes = Router()

routes.get('/me', verifyAccessToken, UsersController.me)

export default routes
