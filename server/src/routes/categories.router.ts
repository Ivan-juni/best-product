import { Router } from 'express'
import checkRole from '../middlewares/check-role.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'
import categoriesController from '../controllers/categories.controller'
import { ROLES } from '../controllers/types/enums'

export function createCategoriesRoutes(): Router {
  const router = Router()

  router.get('/', asyncHandler(categoriesController.getCategories))

  router.get('/:id', asyncHandler(categoriesController.getCategoryById))

  // ! Admin panel
  router.use(checkRole(ROLES.ADMIN))

  router.post('/', asyncHandler(categoriesController.addCategory))

  // /api/categories?categoryId=
  router.patch('/', asyncHandler(categoriesController.updateCategory))

  // /api/categories?categoryId=
  router.delete('/', asyncHandler(categoriesController.deleteCategory))

  return router
}
