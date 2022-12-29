import User from '../db/models/user.model'
import { changingValues, IUsersQuery } from './types/users.type'
import { removePhoto } from '../utils/remove-photo.util'
import { DeleteType } from './types/products.type'
import Comment from '../db/models/comment.model'
import Favorite from '../db/models/favorite.model'
import Objection from 'objection'

class UserService {
  static async getUserById(id: number): Promise<User> {
    return User.query().findById(id)
  }

  static async getUsers(searchCriteria: IUsersQuery): Promise<Objection.Page<User>> {
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    return User.query()
      .select('id', 'email', 'phone', 'photo', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt')
      .where((qb) => {
        if (searchCriteria.id) {
          qb.where('users.id', '=', +searchCriteria.id)
        }

        if (searchCriteria.firstName) {
          qb.orWhere('users.firstName', 'like', `%${searchCriteria.firstName}%`)
        }
      })
      .page(page, limit)
  }

  static async deleteUser(id: number, src: string): DeleteType {
    await Comment.query().delete().where({ userId: id })
    await Favorite.query().delete().where({ userId: id })
    const deletedUser = await User.query().deleteById(id)

    // Remove photo
    removePhoto(src, 'users')

    return deletedUser
  }

  static async changeRole(id: number, role: string): Promise<User> {
    return User.query().patchAndFetchById(id, { role: role })
  }

  static async editProfile(id: number, src: string, changingValues: changingValues): Promise<User> {
    try {
      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      const user = await User.query().patchAndFetchById(id, changingValues)

      if (changingValues.photo) {
        // Remove old photo
        removePhoto(src, 'users')
      }

      return user
    } catch (error) {
      console.log('Error: ', error)
      if (changingValues.photo) {
        removePhoto(changingValues.photo, 'users')
      }
    }
  }
}

export default UserService
