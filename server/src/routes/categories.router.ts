import express from 'express'
import checkRole from '../middlewares/check-role.middleware'
import categoriesController from '../controllers/categories.controller'

const router = express.Router()

// @route GET /api/categories?categoryId=
// @des Get categories
router.get('/', categoriesController.getCategories)

// ! Admin panel

// @route POST /api/categories
// @des Add a category
router.post('/', checkRole('ADMIN'), categoriesController.addCategory)

// @route DELETE /api/categories?categoryId=
// @des Delete a category
router.delete('/', checkRole('ADMIN'), categoriesController.deleteCategory)

export default router
