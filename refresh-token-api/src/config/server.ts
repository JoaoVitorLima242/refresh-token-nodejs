import app from './app'
import { config } from './vars'

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`API is running on PORT: ${PORT}`)
})
