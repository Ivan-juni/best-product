import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IComment } from '../../../models/IComment'
import { ObjectionPage } from '../../../models/ObjectionPage.model'
import { addComment, deleteComment, fetchComments, updateComment } from './ActionCreators.comments'

export interface CommentsState {
  comments: IComment[]
  total: number
  page: number
  isLoading: boolean
  error: string
}

const initialState: CommentsState = {
  comments: [],
  total: 0,
  page: 0,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: CommentsState) => {
  state.isLoading = false
  state.error = ''
}

const pendingReducer = (state: CommentsState) => {
  state.isLoading = true
}

const rejectionReducer = (state: CommentsState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state: CommentsState, action: PayloadAction<ObjectionPage<IComment[]>>) => {
      return (state = { ...state, comments: action.payload.results, total: action.payload.total })
    },
    updateComment: (state: CommentsState, action: PayloadAction<IComment>) => {
      return (state = {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.id) {
            comment = action.payload
          }
          return comment
        }),
      })
    },
    setCommentsPage: (state: CommentsState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    deleteComment: (state: CommentsState, action: PayloadAction<number>) => {
      return (state = { ...state, comments: state.comments.filter((comment) => comment.id !== action.payload), total: state.total - 1 })
    },
  },
  extraReducers: {
    [fetchComments.fulfilled.type]: fulfilledReducer,
    [addComment.fulfilled.type]: fulfilledReducer,
    [deleteComment.fulfilled.type]: fulfilledReducer,
    [updateComment.fulfilled.type]: fulfilledReducer,

    [fetchComments.pending.type]: pendingReducer,
    [addComment.pending.type]: pendingReducer,
    [deleteComment.pending.type]: pendingReducer,
    [updateComment.pending.type]: pendingReducer,

    [fetchComments.rejected.type]: rejectionReducer,
    [addComment.rejected.type]: rejectionReducer,
    [deleteComment.rejected.type]: rejectionReducer,
    [updateComment.rejected.type]: rejectionReducer,
  },
})

export default commentsSlice.reducer
export const commentsAction = commentsSlice.actions
