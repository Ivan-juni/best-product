export interface IUser {
  id: number
  email: string
  phone: number | null
  firstName: string
  lastName: string
  photo: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}
