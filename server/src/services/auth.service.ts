import User from '../db/models/user.model'
import tokenService from './token.service'
import UserDto from '../dtos/user-dto'
import bcrypt from 'bcrypt'
import { IRegistrationQuery } from './types/auth.type'

class AuthService {
  static async registration({ email, password, firstName, lastName, createdAt, updatedAt, phone, photo }: IRegistrationQuery): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    // хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 3)
    // создаем пользователя
    const user = await User.query().insert({
      email,
      password: hashPassword,
      firstName,
      lastName,
      // role,
      phone,
      photo,
      createdAt,
      updatedAt,
    })
    // создаем модель пользователя, чтобы передать в generateTokens
    // туда нельзя передавать пароль и другую постороннюю ин-цию,
    // поэтому мы создаем  data transfer object (dto) c email, id, role
    const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role, photo
    // генерируем пару токенов для пользователя
    const tokens = await tokenService.generateTokens({ ...userDto })
    // сохраняем refreshToken для пользователя в бд
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    // объект - accessToken, refreshToken + user: id, email, phone, firstName, lastName, role, photo
    return { ...tokens, user: userDto }
  }

  static async login(email: string): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    const user = await User.query().findOne({ email })

    const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role, photo
    const tokens = await tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  static async logout(refreshToken: string): Promise<number> {
    // удаляем refreshToken из бд
    return tokenService.removeToken(refreshToken)
  }

  static async refresh(userData: UserDto): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    // получаем пользователя из бд (вдруг за это время
    // ин-ция про него изменилась и нужно зашить в токен новую)
    const user = await User.query().findOne({ id: userData.id })
    const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role, photo
    // генерируем свежую пару токенов для пользователя
    const tokens = await tokenService.generateTokens({ ...userDto })

    // сохраняем refreshToken пользователя в бд
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

export default AuthService
