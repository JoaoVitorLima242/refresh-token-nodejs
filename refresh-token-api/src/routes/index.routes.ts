import { Router } from 'express'

import AuthRoutes from './auth.routes'
import UserRoutes from './user.routes'

const routes = Router()

const IndexRoutes = routes.get('/', (_, res) => {
  res.status(200).json({ message: 'Api is running!' })
})

export { IndexRoutes, AuthRoutes, UserRoutes }
