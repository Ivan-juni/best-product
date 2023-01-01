import React, { useState } from 'react'
import styles from './comment.module.scss'
import { ReactComponent as EditIcon } from 'assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/other/delete-icon.svg'
import withoutAvatar from 'assets/images/without-photo-user.png'
import { IComment } from 'models/comment.model'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteComment, updateComment } from 'store/slices/comments/comments.action-creators'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FormikType } from 'models/formik.model'
import { getUser } from 'store/slices/auth/auth.selectors'
import { ROLES } from 'models/user.model'

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
  const { id: userId, role } = useAppSelector(getUser)
  const [isEditMode, setEditMode] = useState<boolean>(false)

  const deleteCommentHandler = () => {
    dispatch(deleteComment({ id: comment.id }))
  }

  const initialValues = {
    text: comment.text ? comment.text : '',
  }

  const onSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: FormikType) => {
    dispatch(updateComment({ setSubmitting, setStatus, id: comment.id, ...values }))
    setEditMode(false)
  }

  const validationSchema = Yup.object({
    text: Yup.string().min(10, 'Comment should be longer than 10 symbols').required('Required field'),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
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
                    <div className={styles.error}>
                      <ErrorMessage name='text' className={styles.error} />
                    </div>
                    <Field
                      as='textarea'
                      name='text'
                      onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          formik.submitForm()
                        }
                      }}
                    />
                    <button type='submit' className={styles.submit} disabled={!formik.isValid || formik.isSubmitting}>
                      {formik.isSubmitting ? 'Please wait...' : 'Save changes'}
                    </button>
                  </div>
                ) : (
                  <p>{comment.text}</p>
                )}
              </div>
              <div className={styles.menu}>
                {(userId === comment.userId || role === ROLES.ADMIN) && (
                  <DeleteIcon className={styles.deleteIcon} onClick={() => deleteCommentHandler()} />
                )}
                {userId === comment.userId && <EditIcon onClick={() => setEditMode((prev) => !prev)} />}
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Comment
