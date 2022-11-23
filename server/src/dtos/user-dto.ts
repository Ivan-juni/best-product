import User from '../db/models/user/user.model'

class UserDto {
  email: string
  phone: number | null
  id: number
  firstName: string
  lastName: string
  role: string
  photo: string | null
  createdAt: Date
  updatedAt: Date

  constructor(model: User) {
    this.email = model.email
    this.phone = model.phone
    this.id = model.id
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.role = model.role
    this.photo = model.photo
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}

export default UserDto
