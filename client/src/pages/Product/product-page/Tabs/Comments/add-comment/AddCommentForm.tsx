import React from 'react'
import styles from './AddCommentForm.module.scss'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import { FormikType } from '../../../../../../models/Formik.model'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../../../hoooks/redux'
import { addComment } from '../../../../../../store/slices/comments/ActionCreators.comments'

type PropsType = {
  productId: number
}

const AddCommentForm: React.FC<PropsType> = ({ productId }) => {
  const dispatch = useAppDispatch()
  const { isAuth } = useAppSelector((state) => state.authReducer)

  const initialValues = {
    text: '',
  }

  type InitialValuesType = typeof initialValues

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus, resetForm }: FormikType) => {
    dispatch(addComment({ setSubmitting, setStatus, productId, ...values }))
    if (resetForm) {
      resetForm()
    }
  }

  const validationSchema = Yup.object({
    text: Yup.string().min(10, 'Comment should be longer than 10 symbols').required('Required field'),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
            <div className={styles.wrapper}>
              {productId && (
                <>
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
                  </div>

                  <button type='submit' className={styles.submit} disabled={!isAuth || !formik.isValid || formik.isSubmitting}>
                    {formik.isSubmitting ? 'Please wait...' : 'Add comment'}
                  </button>

                  <div className={styles.status}>{formik.status}</div>
                </>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AddCommentForm
