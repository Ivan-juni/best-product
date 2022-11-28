import User from '../db/models/user/user.model'
import { changingValues, IUsersQuery } from '../types/users.type'
import path from 'path'
import fs from 'fs'

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

  static async deleteUser(id: number): Promise<number | null> {
    try {
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
      if (oldUser.photo) {
        const oldPath = path.join(
          __dirname,
          '..',
          '..',
          'assets',
          'users',
          path.basename(oldUser.photo)
        )

        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }

      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      return User.query().patchAndFetchById(id, changingValues)
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}

export default UserService
