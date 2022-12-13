export interface IUser {
  id: number
  email: string
  phone: number | null
  firstName: string
  lastName: string
  photo: string | null
  // password: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}