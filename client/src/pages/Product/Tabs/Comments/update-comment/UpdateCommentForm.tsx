import React from 'react'
import styles from './UpdateCommentForm.module.scss'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import { FormikType } from '../../../../../models/Formik.model'
import * as Yup from 'yup'
import { useAppDispatch } from '../../../../../hoooks/redux'
import { updateComment } from '../../../../../store/slices/comments/ActionCreators.comments'

type PropsType = {
  commentId: number
}

const UpdateCommentForm: React.FC<PropsType> = ({ commentId }) => {
  const dispatch = useAppDispatch()

  const initialValues = {
    text: '',
  }

  type InitialValuesType = typeof initialValues

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(updateComment({ setSubmitting, setStatus, id: commentId, ...values }))
  }

  const validationSchema = Yup.object({
    text: Yup.string()
      .min(10, 'Comment should be longer than 10 symbols')
      .max(255, 'Comment should be shorter than 255 symbols')
      .required('Required field'),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
            <div className={styles.wrapper}>
              <div className={styles.formControl}>
                <div className={styles.error}>
                  <ErrorMessage name='text' className={styles.error} />
                </div>
                <Field as='textarea' name='text' />
              </div>

              <button type='submit' className={styles.submit} disabled={!formik.isValid || formik.isSubmitting}>
                {formik.isSubmitting ? 'Please wait...' : 'Save changes'}
              </button>

              <div className={styles.status}>{formik.status}</div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UpdateCommentForm
