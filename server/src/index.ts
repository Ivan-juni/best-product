import express, { Request, Response } from 'express'
import setupDb from './db/db.setup'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import router from './routes/router'
import errorHandler from './middlewares/error-handling.middleware'
import path from 'path'

const app = express()

app.get('/', (req: Request, res: Response) => res.status(200).json({ message: 'Server is working' }))

const start = async () => {
  try {
    setupDb()

    dotenv.config()

    const port = process.env.PORT || 8000

    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Credentials', 'true')
      next()
    })

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // Path to images folder
    app.use('/static', express.static(path.join(__dirname, '..', 'assets')))

    // main router
    app.use('/api', router)

    // Обработка ошибок, последний middleware
    app.use(errorHandler)

    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
