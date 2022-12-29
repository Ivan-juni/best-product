import Category from '../db/models/category.model'

export const getCategoryId = async (category: string): Promise<number> => {
  // находим id написанной категории
  const categoryId = await Category.query().select('categories.id').where('categories.name', '=', `${category}`).first()

  return categoryId.id
}
