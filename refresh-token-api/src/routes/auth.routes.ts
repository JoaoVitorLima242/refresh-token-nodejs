import { Router } from 'express'
import AuthController from '../controllers/auth'

const routes = Router()

routes.post('/sign-up', AuthController.signUp)

export default routes
