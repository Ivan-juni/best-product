import { IUser } from '../users-service/user.model'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: IUser
}
