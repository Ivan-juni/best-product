import express, { Request } from 'express'
import multer from 'multer'
import path from 'path'
import productController from '../controllers/products.controller'
import Product from '../db/models/product.model'
import checkRole from '../middlewares/check-role.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'
import fs from 'fs'
import { replaceSpaces } from '../utils/replace-spaces.util'

const router = express.Router()

// Where store download files
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (!req.body.name && req.query.productId) {
      // достаю имя продукта (если его нет в теле запроса (*put)), чтобы создать с ним папку
      const product = await Product.query().select('products.name').from('products').where('products.id', '=', `${req.query.productId}`).first()

      const folder = product.name

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

router.get('/:id', asyncHandler(productController.getProductById))

router.get('/', asyncHandler(productController.getProducts))

router.get('/statistics/price-dynamics', asyncHandler(productController.getPriceDynamics))

router.get('/characteristics', asyncHandler(productController.getCharacteristics))

router.get('/menuInfo', asyncHandler(productController.getDropdownMenuInfo))

// ! Admin panel
router.use(checkRole('ADMIN'))

router.get('/statistics', asyncHandler(productController.getStatistics))

router.post('/', upload.single('image'), asyncHandler(productController.addProduct))
// Add a product images
router.post('/images', upload.array('image', 5), asyncHandler(productController.addImage))

router.patch('/', upload.single('image'), asyncHandler(productController.updateProduct))

router.delete('/', asyncHandler(productController.deleteProduct))
// Delete a product's images
router.delete('/images', asyncHandler(productController.deleteImage))

export default router
