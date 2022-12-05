import $api from '../index'
import { AxiosResponse } from 'axios'
import { AuthResponse } from './auth.model'

export default class AuthService {
  static async login(email: string, password: string, remember?: boolean): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/login', { email, password, remember })
  }

  static async registration(email: string, password: string, firstName: string, lastName: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/registration', {
      email,
      password,
      firstName,
      lastName,
    })
  }

  static async logout(): Promise<void> {
    return $api.post('/auth/logout')
  }
}
