import React from 'react'
import styles from './AddComment.module.scss'
import { Form, Formik, Field, ErrorMessage, useFormik } from 'formik'
import { FormikType } from '../../../../../models/Formik.model'
import * as Yup from 'yup'
import { useAppDispatch } from '../../../../../hoooks/redux'
import { addComment } from '../../../../../store/slices/comments/ActionCreators.comments'

type PropsType = {
  productId: number
}

const AddComment: React.FC<PropsType> = ({ productId }) => {
  const dispatch = useAppDispatch()

  const initialValues = {
    text: '',
  }

  type InitialValuesType = typeof initialValues

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(addComment({ setSubmitting, setStatus, productId, ...values }))
  }

  const validationSchema = Yup.object({
    text: Yup.string().min(10, 'Comment should be longer than 10 symbols').required('Required field'),
  })

  const commentForm = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  })

  return (
    <Form onSubmit={commentForm.handleSubmit}>
      <div className={styles.wrapper}>
        {productId && (
          <>
            <div className={styles.formControl}>
              <div className={styles.error}>
                <ErrorMessage name='text' className={styles.error} />
              </div>
              <Field as='textarea' name='text' />
            </div>

            <button className={styles.submit} onClick={commentForm.submitForm} disabled={!commentForm.isValid || commentForm.isSubmitting}>
              {commentForm.isSubmitting ? 'Please wait...' : 'Add comment'}
            </button>

            <div className={styles.status}>{commentForm.status}</div>
          </>
        )}
      </div>
    </Form>
  )
}

export default AddComment
