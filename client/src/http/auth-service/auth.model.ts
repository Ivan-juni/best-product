import { IUser } from '../models/IUser.api'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: IUser
}
