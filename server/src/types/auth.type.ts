export interface IRegistrationQuery {
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
  phone: number | null
  photo: string | null
}
