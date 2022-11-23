import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import ApiError from '../errors/ApiError'
import userService from '../services/users.service'

class UsersController {
  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const users = await userService.getUsers(req.query)

    if (!users) {
      return next(ApiError.badRequest(`Fetching users error`))
    }

    return res.json(users)
  }

  static async deleteUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { id } = req.query
    if (!id) {
      next(ApiError.badRequest("User id hasn't typed"))
    }
    const users = await userService.deleteUser(+id)

    if (!users) {
      return next(ApiError.badRequest(`Deletion users error`))
    }

    return res.json(users)
  }

  static async changeRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
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

  static async editProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const { id } = req.user
      const photo = req.file.filename

      const changingValues = req.body

      if (changingValues.phone) {
        changingValues.phone = +changingValues.phone
      }

      if (photo !== null && photo !== undefined) {
        changingValues.photo = `http://localhost:${process.env.PORT}/static/users/${photo}`
      }

      if (
        changingValues.password !== null &&
        changingValues.password !== undefined
      ) {
        // хэшируем пароль
        const hashPassword = await bcrypt.hash(changingValues.password, 3)

        changingValues.password = hashPassword
      }

      if (!id) {
        next(ApiError.unAuthorizedError())
      }

      const user = await userService.editProfile(id, changingValues)

      if (!user) {
        return next(ApiError.badRequest(`Editing profile error`))
      }

      return res
        .status(200)
        .json({ message: 'Profile data changed successfully ' })
    } catch (error) {
      console.log('Error: ', error)
      return res.status(500).json({ message: 'Error: ', error })
    }
  }
}

export default UsersController
