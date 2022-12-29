import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { CommentAddingValues, CommentChangingValues } from './comments.model'
import { ObjectionPage } from '../../models/ObjectionPage.model'
import { IComment, ICommentsQuery } from '../../models/IComment'

export default class CommentsService {
  static async getComments(searchCriteria: ICommentsQuery): Promise<AxiosResponse<ObjectionPage<IComment[]>>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = 3
    }

    return $api.get<ObjectionPage<IComment[]>>(`/comments`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async addComment(productId: number, comment: CommentAddingValues): Promise<AxiosResponse<IComment>> {
    return $api.post<IComment>(`/comments?productId=${productId}`, comment)
  }

  static async updateComment(id: number, changingValues: CommentChangingValues): Promise<AxiosResponse<IComment>> {
    return $api.patch<IComment>(`/comments?commentId=${id}`, changingValues)
  }

  static async deleteComment(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/comments?commentId=${id}`)
  }
}
