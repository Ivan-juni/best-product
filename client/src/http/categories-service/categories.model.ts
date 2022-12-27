export interface CategoryAddingValues {
  parent: number
  name: string
}

export interface CategoryChangingValues {
  parent?: number | null
  name?: string | null
}
