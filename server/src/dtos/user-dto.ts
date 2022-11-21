class UserDto {
  email: string
  phone: number
  id: number
  firstName: string
  lastName: string
  role: string
  //   !todo model type
  constructor(model) {
    this.email = model.email
    this.phone = model.phone
    this.id = model.id
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.role = model.role
  }
}

export default UserDto
