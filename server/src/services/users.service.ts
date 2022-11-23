import User from '../db/models/user/user.model'
import { IUsersQuery } from '../types/users.type'

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
    changingValues: {
      email?: string | null
      firstName?: string | null
      lastName?: string | null
      phone?: number | null
      photo?: string | null
      password?: string | null
    }
  ): Promise<User | null> {
    try {
      return User.query().patchAndFetchById(id, changingValues)
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}

export default UserService
