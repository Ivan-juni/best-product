import { createAsyncThunk } from '@reduxjs/toolkit'
import { CommentAddingValues, CommentChangingValues } from '../../../http/comments-service/comments.model'
import CommentsService from '../../../http/comments-service/comments.service'
import { FormikType } from '../../../models/Formik.model'
import { ICommentsQuery } from '../../../models/IComment'
import { commentsAction } from './Comments.slice'

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
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (values.setSubmitting && values.setStatus) {
        values.setStatus(error.response?.data?.message)
        values.setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteComment = createAsyncThunk<void, { id: number }, { rejectValue: string }>('comments/deleteComment', async ({ id }, thunkApi) => {
  try {
    await CommentsService.deleteComment(id)

    thunkApi.dispatch(commentsAction.deleteComment(id))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

type UpdateCommentsType = FormikType & CommentChangingValues & { id: number }

export const updateComment = createAsyncThunk<void, UpdateCommentsType, { rejectValue: string }>(
  'comments/updateComment',
  async (changingValues, thunkApi) => {
    try {
      const { setSubmitting, setStatus, id, ...rest } = changingValues

      const response = await CommentsService.updateComment(id, rest)

      thunkApi.dispatch(fetchComments({ productId: response.data.productId }))

      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (changingValues.setSubmitting && changingValues.setStatus) {
        changingValues.setStatus(error.response?.data?.message)
        changingValues.setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
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
    } catch (error: any) {
      console.log(error.response?.data?.message)

      if (values.setSubmitting && values.setStatus) {
        values.setStatus(error.response?.data?.message)
        values.setSubmitting(false)
      }

      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)
