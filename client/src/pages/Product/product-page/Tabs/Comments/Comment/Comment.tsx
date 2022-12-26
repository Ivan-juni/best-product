import React, { useRef, useState } from 'react'
import styles from './Comment.module.scss'
import { ReactComponent as EditIcon } from '../../../../../../assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from '../../../../../../assets/icons/other/delete-icon.svg'
import withoutAvatar from '../../../../../../assets/images/without-photo-user.png'
import { IComment } from '../../../../../../models/IComment'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '../../../../../../hoooks/redux'
import { deleteComment, updateComment } from '../../../../../../store/slices/comments/ActionCreators.comments'

type PropsType = {
  comment: IComment
  productId: number
}

const formatDate = (date: string) => {
  const newDate = new Date(date)
  return moment(newDate).format('MMMM D, YYYY h : mm A')
}

const Comment: React.FC<PropsType> = ({ comment }) => {
  const dispatch = useAppDispatch()
  const { id: userId, role } = useAppSelector((state) => state.authReducer.user)
  const [isEditMode, setEditMode] = useState(false)

  // достаем значение из текстового поля (при клике на кнопку)
  const commentText: React.RefObject<HTMLTextAreaElement> = useRef(null)

  const deleteCommentHandler = () => {
    dispatch(deleteComment({ id: comment.id }))
  }

  const updateCommentHandler = () => {
    if (commentText.current) {
      dispatch(updateComment({ id: comment.id, text: commentText.current.value }))
      setEditMode(false)
    }
  }

  return (
    <div className={userId === comment.userId ? `${styles.myComment} ${styles.comment}` : styles.comment}>
      <div className={styles.info}>
        <div className={styles.avatar}>
          <img src={comment.userPhoto ? comment.userPhoto : withoutAvatar} alt='avatar' />
        </div>
        <div className={styles.name}>{userId === comment.userId ? 'You' : comment.userFirstName}</div>
        <div className={styles.date}>{formatDate(comment.createdAt)}</div>
      </div>
      <div className={styles.text}>
        {isEditMode ? (
          <div className={styles.formControl}>
            <textarea
              className={styles.textarea}
              defaultValue={comment.text}
              ref={commentText}
              onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  updateCommentHandler()
                }
              }}
            />
            <button type='button' className={styles.submit} disabled={false} onClick={updateCommentHandler}>
              Save changes
            </button>
          </div>
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      <div className={styles.menu}>
        {(userId === comment.userId || role === 'ADMIN') && <DeleteIcon className={styles.deleteIcon} onClick={() => deleteCommentHandler()} />}
        {userId === comment.userId && (
          <EditIcon
            onClick={() => {
              setEditMode((prev) => !prev)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Comment
