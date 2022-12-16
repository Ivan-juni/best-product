import React from 'react'
import styles from './Comment.module.scss'
import { IComment } from '../../../../../models/IComment'
import withoutAvatar from '../../../../../assets/images/without-photo-user.png'
import moment from 'moment'

type PropsType = {
  comment: IComment
  productId: number
}

const formatDate = (date: string) => {
  const newDate = new Date(date)
  return moment(newDate).format('MMMM D, YYYY h : mm A')
}

const Comment: React.FC<PropsType> = ({ comment, productId }) => {
  return (
    <div className={styles.comment}>
      <div className={styles.info}>
        <div className={styles.avatar}>
          <img src={comment.userPhoto ? comment.userPhoto : withoutAvatar} alt='avatar' />
        </div>
        <div className={styles.name}>{comment.userFirstName}</div>
        <div className={styles.date}>{formatDate(comment.createdAt)}</div>
      </div>
      <div className={styles.text}>
        <p>{comment.text}</p>
      </div>
    </div>
  )
}

export default Comment
