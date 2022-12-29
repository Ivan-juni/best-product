import { RootStateType } from 'store/store'

export const getCommentsState = (state: RootStateType) => state.commentsReducer
