import { Router } from 'express'

const routes = Router()

routes.get('/', (_, res) => {
  res.status(200).json({ message: 'Auth is running!' })
})

export default routes
