export interface ICategorySearchCriteria {
  categoryId?: number | null
  categoryName?: string | null
  limit: number
  page: number
}

export interface ICategoryBody {
  name?: string | null
  parent?: number | null
}
