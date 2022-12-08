import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import Preloader from '../../../../../components/Common/Preloader/Preloader'
import { useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { fetchUsers } from '../../../../../store/slices/users/ActionCreators.users'
import User from './User/User'
import styles from './UsersTab.module.scss'
import { FormikType } from '../../../../../models/Formik.model'
import { IUser } from '../../../../../http/models/IUser.api'
import Paginator from '../../../../../components/Common/Paginator/Paginator'

const UsersTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, total, users } = useAppSelector((state) => state.usersReducer)

  // pagination
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchUsers({ id: null, firstName: null, page, limit: 3 }))
  }, [page])

  const initialValues: InitialValuesType = {
    firstName: '',
    id: '',
  }

  type InitialValuesType = {
    firstName: string | null
    id: string | null
  }

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, 'Firstname should be longer than 2 symbols')
      .max(255, 'Firstname should be shorter than 255 symbols')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    id: Yup.string()
      .min(1, 'Firstname should be at least 1 symbol')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
  })

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(fetchUsers({ id: values.id, firstName: values.firstName, setSubmitting, setStatus }))
  }

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className={styles.findUser}>
                <div className={styles.firstname}>
                  <div className={styles.formControl}>
                    <span>First Name</span>
                    <div className={styles.error}>
                      <ErrorMessage name='firstName' />
                    </div>
                    <Field type='text' name='firstName' placeholder='Enter firstname' />
                  </div>
                </div>
                <div className={styles.id}>
                  <div className={styles.formControl}>
                    <span>ID</span>
                    <div className={styles.error}>
                      <ErrorMessage name='id' />
                    </div>
                    <Field type='text' name='id' placeholder='Enter id' />
                  </div>
                </div>
                <button className={styles.find} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  Find
                </button>
                <div className={styles.status}>{formik.status}</div>
              </div>
            </Form>
          )
        }}
      </Formik>
      <div className={isLoading ? styles.loading : styles.users}>
        {isLoading ? <Preloader /> : users.map((user: IUser) => <User key={user.id} user={user} />)}
      </div>
      <div className={styles.pagination}>
        <Paginator total={total} page={page} setPage={setPage} />
      </div>
    </div>
  )
}

export default UsersTab
