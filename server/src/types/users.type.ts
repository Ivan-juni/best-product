export interface IUsersQuery {
  id?: string
  page?: string
  limit?: string
}

export interface changingValues {
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: number | null
  photo: string | null
  password: string | null
}

export interface changingValuesBody {
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: string | number | null
  photo: string | null
  password: string | null
}
