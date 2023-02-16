import { Router } from 'express'
import AuthController from '../controllers/auth'

const routes = Router()

routes.post('/signup', AuthController.signUp)
routes.post('/login', AuthController.login)

export default routes
