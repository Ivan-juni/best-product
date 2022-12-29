import jwt from 'jsonwebtoken'
import Token from '../db/models/token.model'
import UserDto from '../dtos/user-dto'

class TokenService {
  static async generateTokens(payload: UserDto): Promise<{
    accessToken: string
    refreshToken: string
  }> {
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
  }

  static async validateAccessToken(token: string): Promise<UserDto> {
    // получаем payload из токена после верефикации, который мы в него вшивали
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as unknown as UserDto
  }

  static async validateRefreshToken(token: string): Promise<UserDto> {
    // получаем payload из токена после верефикации, который мы в него вшивали
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as unknown as UserDto
  }

  // сохраняем refresh token конкретного пользователя в бд
  // по одному пользователю - один токен
  // при логине на другом устройстве, вас выкинет с того, на котором вы были залогинены
  static async saveToken(userId: number, refreshToken: string): Promise<number | Token> {
    const tokenData = await Token.query().findOne({ userId })

    if (tokenData) {
      // перезаписываем refreshToken, если был старый
      tokenData.refreshToken = refreshToken
      return tokenData.$query().patch()
    }

    // создаем refreshToken, если его нет в бд для этого пользователя
    return Token.query().insert({ userId, refreshToken })
  }

  // удаляем refreshToken токен
  static async removeToken(refreshToken: string): Promise<number> {
    return Token.query().delete().where('refreshToken', refreshToken)
  }

  // ищем в бд refreshToken
  static async findToken(refreshToken: string): Promise<Token> {
    return Token.query().findOne({ refreshToken })
  }
}
export default TokenService
