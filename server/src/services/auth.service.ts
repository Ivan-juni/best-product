import User from '../db/models/user/user.model'
import tokenService from './token.service'
import UserDto from '../dtos/user-dto'
import bcrypt from 'bcrypt'

class AuthService {
  static async registration(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    // role: string,
    createdAt: Date,
    updatedAt: Date,
    phone: number | null
  ): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  } | null> {
    try {
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
        createdAt,
        updatedAt,
      })
      // создаем модель пользователя, чтобы передать в generateTokens
      // туда нельзя передавать пароль и другую постороннюю ин-цию,
      // поэтому мы создаем  data transfer object (dto) c email, id, role
      const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role
      // генерируем пару токенов для пользователя
      const tokens = await tokenService.generateTokens({ ...userDto })
      // сохраняем refreshToken для пользователя в бд
      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      // объект - accessToken, refreshToken + user: id, email, phone, firstName, lastName, role
      return { ...tokens, user: userDto }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  } | null> {
    try {
      const user = await User.query().findOne({ email })

      const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role
      const tokens = await tokenService.generateTokens({ ...userDto })

      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return { ...tokens, user: userDto }
    } catch (error) {
      return null
    }
  }

  static async logout(refreshToken: string): Promise<number | null> {
    // удаляем refreshToken из бд
    try {
      return tokenService.removeToken(refreshToken)
    } catch (error) {
      return null
    }
  }

  static async refresh(refreshToken: string): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  } | null> {
    try {
      // валидируем токен (не подделан и годен)
      const userData = await tokenService.validateRefreshToken(refreshToken)

      // ищем токен в бд
      const tokenFromDb = await tokenService.findToken(refreshToken)

      if (!userData || !tokenFromDb) {
        return null
      }

      // получаем пользователя из бд (вдруг за это время
      // ин-ция про него изменилась и нужно зашить в токен новую)
      const user = await User.query().findOne({ id: userData.id })
      const userDto = new UserDto(user) // id, email, phone, firstName, lastName, role
      // генерируем свежую пару токенов для пользователя
      const tokens = await tokenService.generateTokens({ ...userDto })

      // сохраняем refreshToken пользователя в бд
      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return { ...tokens, user: userDto }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default AuthService
