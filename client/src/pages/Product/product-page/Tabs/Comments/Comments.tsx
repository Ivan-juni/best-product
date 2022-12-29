import { useState } from 'react'
import styles from './Comments.module.scss'
import { useActions, useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { ReactComponent as SortIcon } from '../../../../../assets/icons/filters/sort-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../../../assets/icons/other/arrows/white-arrow-top.svg'
import Comment from './Comment/Comment'
import { IComment } from '../../../../../models/IComment'
import Paginator from '../../../../../components/common/paginator/paginator'
import { fetchComments } from '../../../../../store/slices/comments/ActionCreators.comments'
import AddCommentForm from './add-comment/AddCommentForm'

type PropsType = {
  productId: number
}

const Comments: React.FC<PropsType> = ({ productId }) => {
  const dispatch = useAppDispatch()

  const [isSort, setSort] = useState<boolean>(false)
  const { comments, total, page } = useAppSelector((state) => state.commentsReducer)
  const { isAuth } = useAppSelector((state) => state.authReducer)

  const { setCommentsPage } = useActions()

  const sortByDate = () => {
    setSort((prev) => !prev)
    isSort ? dispatch(fetchComments({ productId, orderByDate: 'high' })) : dispatch(fetchComments({ productId, orderByDate: 'low' }))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <button type='button' className={styles.sort} onClick={() => sortByDate()}>
          <SortIcon />
          <div className={styles.text}>
            <span>Date</span>
            <ArrowUpIcon className={isSort ? `${styles.arrowUp}` : `${styles.arrowDown}`} />
          </div>
        </button>
      </div>
      <div className={styles.comments}>
        {comments.map((comment: IComment) => {
          return <Comment key={comment.id} comment={comment} productId={productId} />
        })}
      </div>
      {comments.length > 0 && (
        <div className={styles.pagination}>
          <Paginator total={total} page={page} setPage={setCommentsPage} limit={3} />
        </div>
      )}
      {isAuth && (
        <div className={styles.add}>
          <AddCommentForm productId={productId} />
        </div>
      )}
    </div>
  )
}

export default Comments
