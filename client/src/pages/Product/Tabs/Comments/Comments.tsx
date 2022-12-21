import React, { useEffect, useState } from 'react'
import { useActions, useAppDispatch, useAppSelector } from '../../../../hoooks/redux'
import { ReactComponent as SortIcon } from '../../../../assets/icons/filters/sort-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../../assets/icons/other/arrows/white-arrow-top.svg'
import styles from './Comments.module.scss'
import Comment from './Comment/Comment'
import { IComment } from '../../../../models/IComment'
import Paginator from '../../../../components/Common/Paginator/Paginator'
import { fetchComments } from '../../../../store/slices/comments/ActionCreators.comments'

type PropsType = {
  productId: number
  isLoaded: boolean
  portalAddRef: React.MutableRefObject<null>
  setRef: React.Dispatch<React.SetStateAction<boolean>>
}

const Comments: React.FC<PropsType> = ({ productId, portalAddRef, setRef, isLoaded }) => {
  const dispatch = useAppDispatch()

  const [isSort, setSort] = useState(false)
  const { comments, total, page } = useAppSelector((state) => state.commentsReducer)
  const { isAuth } = useAppSelector((state) => state.authReducer)

  const { setCommentsPage } = useActions()

  const sortByDate = () => {
    setSort((prev) => !prev)
    isSort ? dispatch(fetchComments({ productId, orderByDate: 'low' })) : dispatch(fetchComments({ productId, orderByDate: 'high' }))
  }

  useEffect(() => {
    setRef(isLoaded)
  }, [isLoaded])

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
          <div ref={portalAddRef} className='add-form'></div>
        </div>
      )}
    </div>
  )
}

export default Comments
