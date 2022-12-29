import Router from 'express'
import usersController from '../controllers/users.controller'
import authMiddleware from '../middlewares/auth.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'
import checkRole from '../middlewares/check-role.middleware'
import multer from 'multer'
import path from 'path'

const router = Router()

// Where store download files
const storage = multer.diskStorage({
  destination: './assets/users/',
  filename: (req, file, callback) => {
    callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

router.use(authMiddleware)
router.patch('/editProfile', upload.single('image'), asyncHandler(usersController.editProfile))

// ! Admin panel
router.use(checkRole('ADMIN'))

router.get('/:id', asyncHandler(usersController.getUserById))

router.get('/', asyncHandler(usersController.getUsers))

router.delete('/', asyncHandler(usersController.deleteUsers))

// ?id=3&role=ADMIN
router.patch('/changeRole', asyncHandler(usersController.changeRole))

export default router
