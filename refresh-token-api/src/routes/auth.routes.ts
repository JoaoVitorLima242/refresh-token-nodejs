import { Router } from 'express'
import AuthController from '../controllers/auth'

const routes = Router()

routes.post('/signup', AuthController.signup)
routes.post('/login', AuthController.login)
routes.post('/refresh-token', AuthController.newRefreshToken)

export default routes
