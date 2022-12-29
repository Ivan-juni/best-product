import { createAsyncThunk } from '@reduxjs/toolkit'
import { CommentAddingValues, CommentChangingValues } from 'http/comments-service/comments.model'
import CommentsService from 'http/comments-service/comments.service'
import { FormikType } from 'models/formik.model'
import { ICommentsQuery } from 'models/comment.model'
import { ErrorType } from 'models/error.model'
import { errorLogic } from '../../utils/errorLogic'
import { commentsAction } from './comments.slice'

type FetchCommentsType = FormikType & ICommentsQuery

export const fetchComments = createAsyncThunk<void, FetchCommentsType, { rejectValue: string }>(
  'comments/fetchComments',
  async (values, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из values
      const { setSubmitting, setStatus, ...searchCriteria } = values

      const criteriaComments = await CommentsService.getComments(searchCriteria)

      thunkApi.dispatch(commentsAction.setComments(criteriaComments.data))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)

export const deleteComment = createAsyncThunk<void, { id: number }, { rejectValue: string }>('comments/deleteComment', async ({ id }, thunkApi) => {
  try {
    await CommentsService.deleteComment(id)

    thunkApi.dispatch(commentsAction.deleteComment(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

type UpdateCommentsType = FormikType & CommentChangingValues & { id: number }

export const updateComment = createAsyncThunk<void, UpdateCommentsType, { rejectValue: string }>(
  'comments/updateComment',
  async (values, thunkApi) => {
    try {
      const { setSubmitting, setStatus, id, ...rest } = values

      const response = await CommentsService.updateComment(id, rest)

      thunkApi.dispatch(fetchComments({ productId: response.data.productId }))

      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)

type AddCommentType = CommentAddingValues & FormikType

export const addComment = createAsyncThunk<void, { productId: number } & AddCommentType, { rejectValue: string }>(
  'comments/addComment',
  async (values, thunkApi) => {
    try {
      const { setStatus, setSubmitting, productId, ...comment } = values

      await CommentsService.addComment(productId, comment)

      thunkApi.dispatch(fetchComments({ productId }))

      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)
