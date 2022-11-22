import Router from 'express'
import usersController from '../controllers/users.controller'
import checkRole from '../middlewares/check-role.middleware'

const router = Router()

// ! Admin panel
// @route get /api/users || /api/users?id=
// @des Get users
router.get('/', checkRole('ADMIN'), usersController.getUsers)

// @route get /api/users?id=
// @des Delete user by id
router.delete('/', checkRole('ADMIN'), usersController.deleteUsers)

// @route get /api/users/changeRole?id=3&role=ADMIN
// @des Change user role
router.put('/changeRole', checkRole('ADMIN'), usersController.changeRole)

export default router
