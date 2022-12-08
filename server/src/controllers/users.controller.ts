import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import ApiError from '../errors/ApiError'
import userService from '../services/users.service'
import { changingValuesBody } from '../services/types/users.type'
import { ReturnType } from './types/return.type'
import User from '../db/models/user/user.model'
import Objection from 'objection'

class UsersController {
  static async getUsers(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<User> | null> {
    const users = await userService.getUsers(req.query)

    if (!users) {
      return next(ApiError.badRequest(`Fetching users error`))
    }

    return res.json(users)
  }

  static async deleteUsers(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { id } = req.query
    if (!id) {
      next(ApiError.badRequest("User id hasn't typed"))
    }
    const result = await userService.deleteUser(+id)

    if (!result) {
      return next(ApiError.badRequest(`Deletion users error`))
    }

    if (typeof result == 'number') {
      return res.json({ message: `Successfully deleted ${result} users` })
    } else {
      return res.json(result)
    }
  }

  static async changeRole(req: Request, res: Response, next: NextFunction): ReturnType<User> {
    const { id, role } = req.query
    if (!id) {
      next(ApiError.badRequest("User id hasn't typed"))
    }
    const user = await userService.changeRole(+id, role.toString())

    if (!user) {
      return next(ApiError.badRequest(`Updating role error`))
    }

    return res.json(user)
  }

  static async editProfile(req: Request, res: Response, next: NextFunction): ReturnType<User> {
    try {
      const { id } = req.user
      const photo = req.file !== undefined ? req.file.filename : null

      const changingValues: changingValuesBody = req.body

      if (photo !== null && photo !== undefined) {
        changingValues.photo = `http://localhost:${process.env.PORT}/static/users/${photo}`
      }

      if (changingValues.password !== null && changingValues.password !== undefined) {
        // хэшируем пароль
        const hashPassword = await bcrypt.hash(changingValues.password, 3)

        changingValues.password = hashPassword
      }

      if (!id) {
        return next(ApiError.unAuthorizedError())
      }

      const user = await userService.editProfile(id, {
        photo: changingValues.photo,
        password: changingValues.password,
        phone: +changingValues.phone || null,
        email: changingValues.email,
        firstName: changingValues.firstName,
        lastName: changingValues.lastName,
      })

      if (!user) {
        return next(ApiError.badRequest(`Editing profile error`))
      }

      return res.status(200).json(user)
    } catch (error) {
      console.log('Error: ', error)
      return next(ApiError.badRequest(`${error}`))
    }
  }
}

export default UsersController
