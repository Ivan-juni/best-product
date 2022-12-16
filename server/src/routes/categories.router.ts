import express from 'express'
import checkRole from '../middlewares/check-role.middleware'
import categoriesController from '../controllers/categories.controller'

const router = express.Router()

// @route GET /api/categories?categoryId=
// @des Get categories
router.get('/', categoriesController.getCategories)

// ! Admin panel

// @route POST /api/categories
// @des Add the category
router.post('/', checkRole('ADMIN'), categoriesController.addCategory)

// @route PUT /api/categories?categoryId=
// @des Update the category
router.put('/', checkRole('ADMIN'), categoriesController.updateCategory)

// @route DELETE /api/categories?categoryId=
// @des Delete the category
router.delete('/', checkRole('ADMIN'), categoriesController.deleteCategory)

export default router
