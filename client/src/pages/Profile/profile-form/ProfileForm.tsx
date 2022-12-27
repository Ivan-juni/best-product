import React from 'react'
import styles from './ProfileForm.module.scss'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch } from '../../../hoooks/redux'
import { IUser } from '../../../models/IUser.model'
import { editProfile } from '../../../store/slices/users/ActionCreators.users'
import { FormikType } from '../../../models/Formik.model'

type PropsType = {
  user: IUser
}

const ProfileForm: React.FC<PropsType> = ({ user }) => {
  const dispatch = useAppDispatch()

  const initialValues: InitialValuesType = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ? user.phone.toString() : '',
    password: '',
    confirmNewPassword: '',
  }

  type InitialValuesType = {
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    password: string | null
    confirmNewPassword: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(
      editProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone ? +values.phone : null,
        password: values.password,
        photo: null,
        setStatus,
        setSubmitting,
      })
    )
  }

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, 'Firstname should be longer than 2 symbols')
      .max(255, 'Firstname should be shorter than 255 symbols')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    lastName: Yup.string()
      .min(3, 'Lastname should be longer than 2 symbols')
      .max(255, 'Lastname should be shorter than 255 symbols')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    email: Yup.string()
      .email('Invalid email format')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(4, 'Phone should be longer than 3 symbols')
      .max(12, 'Phone should be shorter than 12 symbols')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    password: Yup.string()
      .min(4, 'Password should be longer than 3 symbols')
      .max(30, 'Password should be shorter than 30 symbols')
      .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
      .oneOf([Yup.ref('confirmNewPassword')], 'Passwords must match')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
            <div className={styles.wrapper}>
              <div className={styles.firstName}>
                <div className={styles.formControl}>
                  <span>First Name</span>
                  <div className={styles.error}>
                    <ErrorMessage name='firstName' />
                  </div>
                  <Field type='text' name='firstName' placeholder='Your firstname' />
                </div>
              </div>
              <div className={styles.lastName}>
                <div className={styles.formControl}>
                  <span>Last Name</span>
                  <div className={styles.error}>
                    <ErrorMessage name='lastName' />
                  </div>
                  <Field type='text' name='lastName' placeholder='Your lastname' />
                </div>
              </div>
              <div className={styles.email}>
                <div className={styles.formControl}>
                  <span>Email address</span>
                  <div className={styles.error}>
                    <ErrorMessage name='email' className={styles.error} />
                  </div>
                  <Field type='email' name='email' placeholder='Email address' />
                </div>
              </div>
              <div className={styles.phone}>
                <div className={styles.formControl}>
                  <span>Phone</span>
                  <div className={styles.error}>
                    <ErrorMessage name='phone' className={styles.error} />
                  </div>
                  <Field type='text' name='phone' placeholder='Phone number (380999999999)' />
                </div>
              </div>
              <div className={styles.password}>
                <div className={styles.formControl}>
                  <span>New password</span>
                  <div className={styles.error}>
                    <ErrorMessage name='password' className={styles.error} />
                  </div>
                  <Field type='password' name='password' placeholder='**********' />
                </div>
              </div>
              <div className={styles.confirmPassword}>
                <div className={styles.formControl}>
                  <span>Confirm new password</span>
                  <div className={styles.error}>
                    <ErrorMessage name='confirmNewPassword' className={styles.error} />
                  </div>
                  <Field type='password' name='confirmNewPassword' placeholder='**********' />
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.changeInfo} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Save All Changes'}
                </button>
              </div>
              <div className={styles.status}>{formik.status}</div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ProfileForm
