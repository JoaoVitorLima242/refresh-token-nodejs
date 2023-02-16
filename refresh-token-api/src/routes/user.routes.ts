import { Router } from 'express'
import UsersController from '../controllers/users'

const routes = Router()

routes.post('/me', UsersController.me)

export default routes
