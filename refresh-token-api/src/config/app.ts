import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import IndexRoutes from '../routes/index.routes'
import ImagesRoutes from '../routes/images.routes'
import { config } from './vars'

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares() {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(express.static('uploads'))
  }

  private database() {
    const uri = config.MONGO_URI

    mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => {
        console.log('Mongo DB is ON!')
      },
    )
  }

  private routes() {
    this.express.use('/', IndexRoutes)
    this.express.use('/images', ImagesRoutes)
  }
}

export default new App().express
