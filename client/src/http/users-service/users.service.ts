import $api from '../index'
import { AxiosResponse } from 'axios'
import { ChangingValues } from './user.model'
import { IUser } from './user.model'
import { DeleteResponse } from '../models/DeleteResponse'
import { ObjectionPage } from '../../models/ObjectionPage.model'

export default class UsersService {
  static async getUserById(id: number): Promise<AxiosResponse<IUser>> {
    return $api.get<IUser>(`/users/${id}`)
  }

  static async getUsers(
    id: string | null = null,
    firstName: string | null = null,
    page: number = 0,
    limit: number = 3
  ): Promise<AxiosResponse<ObjectionPage<IUser[]>>> {
    return $api.get<ObjectionPage<IUser[]>>('/users', {
      params: {
        id,
        firstName,
        page,
        limit,
      },
    })
  }

  static async editProfile(changingValues: ChangingValues): Promise<AxiosResponse<IUser & { password: string }>> {
    const formData = new FormData()
    if (changingValues.photo) {
      formData.append('image', changingValues.photo)

      return $api.patch<IUser & { password: string }>(`/users/editProfile`, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    } else {
      return $api.patch<IUser & { password: string }>(`/users/editProfile`, changingValues, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    }
  }

  static async changeRole(id: number, role: 'ADMIN' | 'USER'): Promise<AxiosResponse<IUser>> {
    return $api.patch<IUser>(`/users/changeRole?id=${id}&role=${role}`)
  }

  static async deleteUser(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/users?id=${id}`)
  }
}
