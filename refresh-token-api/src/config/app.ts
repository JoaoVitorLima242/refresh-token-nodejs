import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { AuthRoutes, IndexRoutes } from '../routes/index.routes'
import { config } from './vars'
import { HttpError, customErrorMiddleware } from '../utils/error'

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.database()
    this.routes()
    this.middlewares()
    this.errorHandler()
  }

  private middlewares() {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(express.static('uploads'))
  }

  private errorHandler() {
    this.express.use(
      (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
        console.log(error)
        res.status(error.statusCode || 500).json({ error: error.message })
      },
    )
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
    this.express.use('/auth', AuthRoutes)
  }
}

export default new App().express
