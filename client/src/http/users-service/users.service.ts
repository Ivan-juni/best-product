import $api from '../index'
import { AxiosResponse } from 'axios'
import { ChangingValues } from './user.model'
import { IUser } from '../../models/IUser.model'
import { DeleteResponse } from '../models/DeleteResponse'
import { ObjectionPage } from '../../models/ObjectionPage.model'

export default class UsersService {
  static async getUsers(
    id: string | null = null,
    firstName: string | null = null,
    page: number = 0,
    limit: number = 3
  ): Promise<AxiosResponse<ObjectionPage<IUser[]>>> {
    return $api.get<ObjectionPage<IUser[]>>(
      `/users?page=${page}&limit=${limit}${
        id && firstName ? `&id=${id}&firstName=${firstName}` : firstName ? `&firstName=${firstName}` : id ? `&id=${id}` : ''
      }`
    )
  }

  static async changeRole(id: number, role: 'ADMIN' | 'USER'): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>(`/users/changeRole?id=${id}&role=${role}`)
  }

  static async editProfile(changingValues: ChangingValues): Promise<AxiosResponse<IUser & { password: string }>> {
    const formData = new FormData()
    if (changingValues.photo) {
      formData.append('image', changingValues.photo)

      return $api.put<IUser & { password: string }>(`/users/editProfile`, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    } else {
      return $api.put<IUser & { password: string }>(`/users/editProfile`, changingValues, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    }
  }

  static async deleteUser(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/users?id=${id}`)
  }
}
