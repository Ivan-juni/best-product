import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'

export default function (
  err: { status: number; message: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }
  return res.status(500).json({ message: 'Unexpected error' })
}
