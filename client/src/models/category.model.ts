export interface ICategory {
  id: number
  parent: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface ICategoryQuery {
  id?: number | null
  name?: string | null
  page?: number
  limit?: number
}
