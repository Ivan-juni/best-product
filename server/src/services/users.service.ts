import User from '../db/models/user/user.model'
import { changingValues, IUsersQuery } from './types/users.type'
import { removePhoto } from '../utils/remove-photo.util'
import { DeleteType } from './types/products.type'
import Comment from '../db/models/comment/comment.model'
import Favorite from '../db/models/favorite/favorite.model'

class UserService {
  static async getUsers(
    searchCriteria: IUsersQuery
  ): Promise<User | User[] | null> {
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    try {
      const users = await User.query()
        .select()
        .where((qb) => {
          if (searchCriteria.id) {
            qb.where('users.id', '=', +searchCriteria.id)
          }
        })
        .page(page, limit)

      return users.results
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteUser(id: number): DeleteType {
    try {
      const user = await User.query().findById(id)

      if (!user) {
        return { message: "Can't find this user" }
      }

      // Remove photo
      removePhoto(user.photo, 'users')

      await Comment.query().delete().where({ userId: id })
      await Favorite.query().delete().where({ userId: id })

      return User.query().deleteById(id)
    } catch (error) {
      return null
    }
  }

  static async changeRole(id: number, role: string): Promise<User | null> {
    try {
      return User.query().patchAndFetchById(id, { role: role })
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async editProfile(
    id: number,
    changingValues: changingValues
  ): Promise<User | { message: string } | null> {
    try {
      const oldUser = await User.query().select().findById(id)

      if (!oldUser) {
        return { message: "Can't find this user" }
      }

      // Remove old photo
      removePhoto(oldUser.photo, 'users')

      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      return User.query().patchAndFetchById(id, changingValues)
    } catch (error) {
      console.log('Error: ', error)
      if (changingValues.photo) {
        removePhoto(changingValues.photo, 'users')
      }
      return null
    }
  }
}

export default UserService
