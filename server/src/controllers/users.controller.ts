import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import userService from '../services/user.service'

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
}

export default UsersController
