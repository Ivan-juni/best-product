import $api from '../index'
import { AxiosResponse } from 'axios'
import { UserResponse } from './user.model'
import { IUser } from '../../models/IUser.model'
import { DeleteResponse } from '../models/DeleteResponse'

export default class UserService {
  static async getUsers(): Promise<AxiosResponse<UserResponse>> {
    return $api.get<UserResponse>('/users')
  }

  static async changeRole(
    id: number,
    role: 'ADMIN' | 'USER'
  ): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>(`/users/changeRole?id=${id}&role=${role}`)
  }

  static async deleteUser(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/users?id=${id}`)
  }
}
