import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'
import bcrypt from 'bcrypt'
import ApiError from '../errors/ApiError'
import userService from '../services/users.service'
import { changingValuesBody } from '../services/types/users.type'
import { ReturnType } from './types/return.type'
import User from '../db/models/user.model'
import Objection from 'objection'
import { editProfileSchema } from './types/schemas'

class UsersController {
  static async getUserById(req: Request, res: Response, next: NextFunction): ReturnType<User> {
    const { id } = req.params
    // проверку на введенный id не делаем, так как есть другой метод getUsers, который просто вернет всех пользователей, если не ввести id

    const users = await userService.getUserById(+id)

    if (!users) {
      return next(ApiError.badRequest(`Fetching users error`))
    }

    return res.json(users)
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<User>> {
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

    if (+id === req.user.id) {
      next(ApiError.badRequest("You can't delete yourself"))
    }

    const user = await User.query().findById(+id)

    if (!user) {
      next(ApiError.internal("Can't find this user"))
    }

    const result = await userService.deleteUser(+id, user.photo)

    if (!result) {
      return next(ApiError.badRequest(`Deletion users error`))
    } else {
      return res.json({ message: `Successfully deleted ${result} users` })
    }
  }

  static async changeRole(req: Request, res: Response, next: NextFunction): ReturnType<User> {
    const { id, role } = req.query
    if (!id) {
      next(ApiError.badRequest("User id hasn't typed"))
    }

    if (+id === req.user.id) {
      next(ApiError.badRequest("You can't change your role"))
    }

    const oldUser = await User.query().findById(+id)

    if (!oldUser) {
      next(ApiError.internal("Can't find this user"))
    }

    const user = await userService.changeRole(+id, role.toString())

    if (!user) {
      return next(ApiError.badRequest(`Updating role error`))
    }

    return res.json(user)
  }

  static async editProfile(req: Request, res: Response, next: NextFunction): ReturnType<User> {
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

    const oldUser = await User.query().select().findById(id)

    if (!oldUser) {
      next(ApiError.internal("Can't find this user"))
    }

    await editProfileSchema.validate({ ...changingValues, photo })

    const user = await userService.editProfile(id, oldUser.photo, {
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
  }
}

export default UsersController
