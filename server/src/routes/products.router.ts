import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// Where store download files
const storage = multer.diskStorage({
  destination: './assets/products',
  filename: (req: Request, file, callback) => {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage })

// @route POST /api/goods/ || /api/goods?id= || /api/goods?category= || /api/goods?price=800-1000 etc.
// @des Get goods
router.get('/', () => {})

// ! Admin panel
// @route POST /api/goods/
// @des Add a good
router.post('/', upload.single('image'), () => {})

// @route DELETE /api/goods?id=
// @des Delete a good
router.delete('/', () => {})

export default router
