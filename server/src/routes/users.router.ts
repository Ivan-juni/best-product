import Router from 'express'
import usersController from '../controllers/users.controller'
import authMiddleware from '../middlewares/auth.middleware'
import checkRole from '../middlewares/check-role.middleware'
import multer from 'multer'
import path from 'path'

const router = Router()

// Where store download files
const storage = multer.diskStorage({
  destination: './assets/users/',
  filename: (req, file, callback) => {
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

// @route put /api/users/changePassword
// @des Change user role
router.put(
  '/editProfile',
  authMiddleware,
  upload.single('image'),
  usersController.editProfile
)

// ! Admin panel
// @route get /api/users || /api/users?id=
// @des Get users
router.get('/', checkRole('ADMIN'), usersController.getUsers)

// @route delete /api/users?id=
// @des Delete user by id
router.delete('/', checkRole('ADMIN'), usersController.deleteUsers)

// @route put /api/users/changeRole?id=3&role=ADMIN
// @des Change user role
router.put('/changeRole', checkRole('ADMIN'), usersController.changeRole)

export default router
