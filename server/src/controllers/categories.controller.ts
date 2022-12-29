import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'
import ApiError from '../errors/ApiError'
import categoriesService from '../services/categories.service'
import { ReturnType } from './types/return.type'
import Category from '../db/models/category.model'
import Objection from 'objection'
import { ICategoryBody } from '../services/types/categories.type'
import { addCategorySchema, updCategorySchema } from './types/schemas'

export default class CategoriesController {
  static async getCategoryById(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Category>> {
    const { id } = req.params

    const category = await categoriesService.getCategoryById(+id)

    if (!category) {
      return next(ApiError.badRequest(`Fetching category error`))
    }

    return res.json(category)
  }

  static async getCategories(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Category>> {
    const categoryId = +req.query.id || null
    const categoryName = req.query.name || null
    const limit = +req.query.limit || 5
    const page = +req.query.page || 0

    const categories = await categoriesService.getCategories({
      categoryId,
      categoryName: categoryName ? categoryName.toString() : null,
      limit,
      page,
    })

    if (!categories) {
      return next(ApiError.badRequest(`Fetching categories error`))
    }

    return res.json(categories)
  }

  static async addCategory(req: Request, res: Response, next: NextFunction): ReturnType<Category> {
    const categoryName: string = req.body.name
    const parent: number = req.body.parent ? +req.body.parent : 0

    await addCategorySchema.validate({ categoryName, parent })

    const productCategory = await Category.query().findOne({
      name: categoryName,
    })

    if (productCategory) {
      return next(ApiError.internal('Category with this name already exists'))
    }

    const category = await categoriesService.addCategory({
      name: categoryName,
      parent: +parent,
    })

    if (!category) {
      return next(ApiError.badRequest(`Adding category error`))
    }

    return res.json(category)
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction): ReturnType<Category> {
    const { categoryId } = req.query
    const changingValues: ICategoryBody = req.body

    if (!categoryId) {
      return next(ApiError.badRequest('Please, type the category id'))
    }

    const oldCategory = await Category.query().select().findById(+categoryId)

    if (!oldCategory) {
      return next(ApiError.internal("Can't find this category"))
    }

    await updCategorySchema.validate(changingValues)

    const category = await categoriesService.updateCategory(+categoryId, {
      name: changingValues.name ? changingValues.name : null,
      parent: changingValues.parent ? +changingValues.parent : null,
    })

    if (!category) {
      return next(ApiError.badRequest(`Updating category error`))
    }

    return res.json(category)
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { categoryId } = req.query

    if (!categoryId) {
      return next(ApiError.internal('Please, type the category id'))
    }

    const oldCategory = await Category.query().select().findById(+categoryId)

    if (!oldCategory) {
      return next(ApiError.internal("Can't find this category"))
    }

    const result = await categoriesService.deleteCategory(+categoryId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion category error`))
    } else {
      return res.json({ message: `Successfully deleted ${result} categories` })
    }
  }
}
