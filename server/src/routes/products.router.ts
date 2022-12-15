import express, { Request } from 'express'
import multer from 'multer'
import path from 'path'
import productController from '../controllers/products.controller'
import Product from '../db/models/product.model'
import checkRole from '../middlewares/check-role.middleware'
import fs from 'fs'
import { replaceSpaces } from '../utils/replace-spaces.util'

const router = express.Router()

// Where store download files
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (!req.body.name && req.query.productId) {
      // достаю имя продукта (если его нет в теле запроса (*put)), чтобы создать с ним папку
      const product = await Product.query().select('products.name').from('products').where('products.id', '=', `${req.query.productId}`)

      const folder = product[0].name

      const path = `./assets/products/${replaceSpaces(folder)}/`
      fs.mkdirSync(path, { recursive: true })

      return cb(null, path)
    } else {
      const folder = req.body.name

      const path = `./assets/products/${replaceSpaces(folder)}/`
      fs.mkdirSync(path, { recursive: true })

      return cb(null, path)
    }
  },
  filename: (req: Request, file, callback) => {
    callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

// @route POST /api/products/ || /api/products?id= || /api/products?category= || /api/products?price=800-1000 etc. || /api/products?orderByPrice=high/low || /api/products?orderByFavoriteStars=high/low
// @des Get products
router.get('/', productController.getProducts)

// @route GET /api/products/statistics?quantity=5
// @des Get products
router.get('/statistics', checkRole('ADMIN'), productController.getStatistics)

// @route GET /api/products/statistics/price-dynamics
// @des Get products
router.get('/statistics/price-dynamics', productController.getPriceDynamics)

// @route GET /api/products/characteristics?productId=5
// @des Get product characteristics
router.get('/characteristics', productController.getCharacteristics)

// ! Admin panel
// @route POST /api/products/
// @des Add a product
router.post('/', checkRole('ADMIN'), upload.single('image'), productController.addProduct)

// @route POST /api/products/images?productId=
// @des Add a product images
router.post('/images', checkRole('ADMIN'), upload.array('image', 5), productController.addImage)

// @route PUT /api/products?productId=
// @des Update the product
router.put('/', checkRole('ADMIN'), upload.single('image'), productController.updateProduct)

// @route DELETE /api/products?productId=
// @des Delete a product
router.delete('/', checkRole('ADMIN'), productController.deleteProduct)

// @route DELETE /api/products/images?productId=&imageId=
// @des Delete a product's images
router.delete('/images', checkRole('ADMIN'), productController.deleteImage)

export default router
