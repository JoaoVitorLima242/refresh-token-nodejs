import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { AuthRoutes, IndexRoutes } from '../routes/index.routes'
import { config } from './vars'
import { customErrorMiddleware } from '../utils/error'
import logger from '../utils/logger'

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.middlewares()
    this.database()
    this.routes()
    this.errorHandler()
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
        logger.info('Mongo DB is ON!')
      },
    )
  }

  public errorHandler() {
    this.express.use(customErrorMiddleware)
  }

  private routes() {
    this.express.use('/', IndexRoutes)
    this.express.use('/auth', AuthRoutes)
  }
}

export default new App().express
