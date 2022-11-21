import UserDto from './dtos/user-dto'

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto
    }
  }
}
