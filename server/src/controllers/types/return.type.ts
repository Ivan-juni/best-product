import { Response } from 'express'

export type ReturnType<T> = Promise<void | Response<T, Record<string, string>>>
