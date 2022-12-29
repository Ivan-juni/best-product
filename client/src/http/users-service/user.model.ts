import { ROLES } from 'models/user.model'

export interface IUser {
  id: number
  email: string
  phone: number | null
  firstName: string
  lastName: string
  photo: string | null
  role: ROLES.USER | ROLES.ADMIN
  createdAt: string
  updatedAt: string
}

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
