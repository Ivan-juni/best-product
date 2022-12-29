export enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

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
