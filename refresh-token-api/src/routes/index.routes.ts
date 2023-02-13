import { Router } from 'express'

import AuthRoutes from './auth.routes'

const routes = Router()

const IndexRoutes = routes.get('/', (_, res) => {
  res.status(200).json({ message: 'Api is running!' })
})

export { IndexRoutes, AuthRoutes }
