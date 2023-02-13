import { Router } from 'express'
import multer from 'multer'

import ImageControllers from '../controllers/images'

const upload = multer({ dest: './uploads/' })
const routes = Router()

routes.post('/', upload.single('image'), ImageControllers.uploadImage)
routes.get('/:key', ImageControllers.getImageByKey)

export default routes
