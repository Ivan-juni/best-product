import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'
import ApiError from '../errors/ApiError'
import bcrypt from 'bcrypt'
import User from '../db/models/user/user.model'
import userService from '../services/auth.service'
import { ReturnType } from './types/return.type'

const registrationSchema = yup.object({
  email: yup.string().email().required(),
  phone: yup.number().nullable(),
  password: yup
    .string()
    .min(4, 'Password should be longer than 3 symbols')
    .max(30, 'Password should be shorter than 30 symbols')
    .matches(/^[A-Za-z]+$/, 'Only English letters')
    .required(),
  firstName: yup.string().max(255, 'Firstname should be shorter than 3 symbols').required(),
  lastName: yup.string().max(255, 'Lastname should be shorter than 3 symbols').required(),
  role: yup.string().nullable().default('USER').min(4).max(5),
  photo: yup.string().nullable().default(null),
  createdAt: yup.date(),
  updatedAt: yup.date(),
})

type IUser = yup.InferType<typeof registrationSchema>

class AuthController {
  static async registration(req: Request, res: Response, next: NextFunction): ReturnType<typeof userData> {
    try {
      await registrationSchema.validate(req.body)
    } catch (err) {
      return next(ApiError.internal(`Validation error: ${err.message}`))
    }

    // достаем введенные пользователем данные
    const { email }: IUser = req.body

    // проверяем есть ли такой пользователь в базе
    const candidate = await User.query().findOne({ email })

    if (candidate !== undefined) {
      return next(ApiError.badRequest(`User with the e-mail ${email} already exists`))
    }
    //

    const userData = await userService.registration(req.body)

    if (!userData) {
      return next(ApiError.badRequest(`Registration error`))
    }

    // храним refreshToken в куках
    if (req.body.remember && req.body.remember !== undefined) {
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires after 30 days
        httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
      })
    } else {
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 3 * 60 * 1000, // Cookie expires after 3 mins
        httpOnly: true,
      })
    }

    return res.json(userData)
  }

  static async login(req: Request, res: Response, next: NextFunction): ReturnType<typeof userData> {
    const { email, password }: IUser = req.body

    const user = await User.query().findOne({ email })

    if (user == undefined) {
      return next(ApiError.badRequest(`User with the e-mail ${email} doesn't exist`))
    }

    // сравниваем введенный пароль с захэшированным в базе данных
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      return next(ApiError.badRequest(`Incorrect password`))
    }

    const userData = await userService.login(email)

    if (!userData) {
      return next(ApiError.badRequest(`Login error`))
    }

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    return res.json(userData)
  }

  static async logout(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    // достаем из кукис refreshToken
    const { refreshToken }: { refreshToken: string } = req.cookies
    const token = await userService.logout(refreshToken)

    if (!token) {
      return next(ApiError.badRequest(`Logout error`))
    }

    // удаляем refreshToken из кукис
    res.clearCookie('refreshToken')
    if (token === 1) {
      return res.json({ message: 'Logout successfully' })
    } else {
      return res.json({ message: 'Sth goes wrong...' })
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): ReturnType<typeof userData> {
    // достаем из кукис refreshToken
    const { refreshToken }: { refreshToken: string } = req.cookies

    // если токена нет в куках, пользователь не авторизован
    if (!refreshToken) {
      return next(ApiError.unAuthorizedError())
    }

    // обновляем refreshToken
    const userData = await userService.refresh(refreshToken)

    if (!userData) {
      return next(ApiError.badRequest(`Refresh token error`))
    }

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    return res.json(userData)
  }
}

export default AuthController
