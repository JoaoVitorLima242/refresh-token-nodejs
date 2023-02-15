import logger from '../utils/logger'
import app from './app'
import { config } from './vars'

const PORT = config.PORT

app.listen(PORT, () => {
  logger.info(`API is running on PORT: ${PORT}`)
})
