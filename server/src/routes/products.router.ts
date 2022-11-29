import express, { Request } from 'express'
import multer from 'multer'
import path from 'path'
import productController from '../controllers/products.controller'
import checkRole from '../middlewares/check-role.middleware'

const router = express.Router()

// Where store download files
const storage = multer.diskStorage({
  destination: './assets/products',
  filename: (req: Request, file, callback) => {
    callback(
      null,
      path.parse(file.originalname).name +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage })

// @route POST /api/products/ || /api/products?id= || /api/products?category= || /api/products?price=800-1000 etc. || /api/products?orderByPrice=high/low || /api/products?orderByFavoriteStars=high/low
// @des Get products
router.get('/', productController.getProducts)

// @route GET /api/products/statistics?quantity=5
// @des Get products
router.get('/statistics', checkRole('ADMIN'), productController.getStatistics)

// @route GET /api/products/characteristics?productId=5
// @des Get product characteristics
router.get('/characteristics', productController.getCharacteristics)

// ! Admin panel
// @route POST /api/products/
// @des Add a product
router.post(
  '/',
  checkRole('ADMIN'),
  upload.single('image'),
  productController.addProduct
)

// @route PUT /api/products/
// @des Update the product
router.put(
  '/',
  checkRole('ADMIN'),
  upload.single('image'),
  productController.updateProduct
)

// @route DELETE /api/products?productId=
// @des Delete a product
router.delete('/', checkRole('ADMIN'), productController.deleteProducts)

export default router
