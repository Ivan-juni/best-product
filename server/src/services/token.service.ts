import jwt from 'jsonwebtoken'
import Token from '../db/models/token.model'
import UserDto from '../dtos/user-dto'

class TokenService {
  static async generateTokens(payload: UserDto): Promise<{
    accessToken: string
    refreshToken: string
  } | null> {
    try {
      // генерируем пару токенов
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '30m',
      })
      // токен, который обновляет access token, когда мы заходим на сайт. Если не заходить 30 дней, нужно будет снова логиниттся
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
      })

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async validateAccessToken(token: string): Promise<UserDto | null> {
    try {
      // получаем payload из токена после верефикации, который мы в него вшивали
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as unknown as UserDto
      return userData
    } catch (error) {
      return null
    }
  }

  static async validateRefreshToken(token: string): Promise<UserDto | null> {
    try {
      // получаем payload из токена после верефикации, который мы в него вшивали
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as unknown as UserDto
      return userData
    } catch (error) {
      return null
    }
  }

  // сохраняем refresh token конкретного пользователя в бд
  // по одному пользователю - один токен
  // при логине на другом устройстве, вас выкинет с того, на котором вы были залогинены
  static async saveToken(userId: number, refreshToken: string) {
    try {
      const tokenData = await Token.query().findOne({ userId })
      if (tokenData) {
        // перезаписываем refreshToken, если был старый
        tokenData.refreshToken = refreshToken
        return tokenData.$query().patch()
      }
      // создаем refreshToken, если его нет в бд для этого пользователя
      const token = await Token.query().insert({ userId, refreshToken })
      return token
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // удаляем refreshToken токен
  static async removeToken(refreshToken: string): Promise<number | null> {
    try {
      const tokenData = await Token.query().delete().where('refreshToken', refreshToken)
      return tokenData
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // ищем в бд refreshToken
  static async findToken(refreshToken: string) {
    try {
      const tokenData = await Token.query().findOne({ refreshToken })
      return tokenData
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
export default TokenService
