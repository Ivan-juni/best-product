import express, { Request, Response } from 'express'
import setupDb from './db/db.setup'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

const app = express()

app.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Server is working' })
)

const start = async () => {
  try {
    setupDb()

    dotenv.config()

    const port = process.env.PORT || 8000

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
