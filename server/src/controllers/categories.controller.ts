import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import categoriesService from '../services/categories.service'
import { ReturnType } from './types/return.type'
import Objection from 'objection'
import Category from '../db/models/category.model'

export default class CategoriesController {
  static async getCategories(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Category>> {
    const categoryId = +req.params || null
    const page = +req.query.page || 0
    const limit = +req.query.limit || 5

    const categories = await categoriesService.getCategories({
      categoryId,
      page,
      limit,
    })

    if (!categories) {
      return next(ApiError.badRequest(`Fetching categories error`))
    }

    return res.json(categories)
  }

  static async addCategory(req: Request, res: Response, next: NextFunction): ReturnType<Category> {
    const categoryName: string = req.body.name
    const parent: number = +req.body.parent || 0

    if (!categoryName) {
      return next(ApiError.internal('Please, type the category name'))
    }

    if (!parent) {
      return next(ApiError.internal('Please, type the category parent'))
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

  static async deleteCategory(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { categoryId } = req.params

    if (!categoryId) {
      return next(ApiError.internal('Please, type the category id'))
    }

    const result = await categoriesService.deleteCategory(+categoryId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion category error`))
    }

    if (typeof result == 'number') {
      return res.json({ message: `Successfully deleted ${result} categories` })
    } else {
      return res.json(result)
    }
  }
}
