import { IUser } from '../models/IUser.api'

export interface UsersResponse {
  results: IUser[]
  total: number
}

export interface ChangingValues {
  email: string | null
  phone: number | null
  firstName: string | null
  lastName: string | null
  photo: string | File | null
  password: string | null
}
