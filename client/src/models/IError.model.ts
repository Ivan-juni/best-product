import { AxiosError } from 'axios'

interface IError {
  message: string
}

export type ErrorType = AxiosError<IError>
