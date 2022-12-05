import { IUser } from '../models/IUser.api'

export interface UserResponse {
  results: IUser[]
  total: number
}
