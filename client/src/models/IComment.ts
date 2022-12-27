export interface IComment {
  id: number
  userId: number
  productId: number
  text: string
  userEmail: string
  userFirstName: string
  userLastName: string
  userPhoto: string | null
  createdAt: string
  updatedAt: string
}

export interface ICommentsQuery {
  productId: number
  page?: number
  limit?: number
  orderByDate?: string
}
