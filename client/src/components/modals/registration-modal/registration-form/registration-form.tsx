import React from 'react'
import styles from './registration-form.module.scss'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { registration } from 'store/slices/auth/auth.action-creators'
import { useAppDispatch } from 'hooks/redux'
import { FormikType } from 'models/formik.model'

const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch()

  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  }

  type InitialValuesType = typeof initialValues

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(registration({ ...values, setStatus, setSubmitting }))
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required field'),
    password: Yup.string()
      .min(4, 'Password should be longer than 3 symbols')
      .max(30, 'Password should be shorter than 30 symbols')
      .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
      .required('Required field'),
    firstName: Yup.string()
      .min(3, 'Firstname should be longer than 2 symbols')
      .max(255, 'Firstname should be shorter than 255 symbols')
      .required('Required field'),
    lastName: Yup.string()
      .min(3, 'Lastname should be longer than 2 symbols')
      .max(255, 'Lastname should be shorter than 255 symbols')
      .required('Required field'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required(),
  })

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
              <div className={styles.password}>
                <div className={styles.formControl}>
                  <span>Password</span>
                  <div className={styles.error}>
                    <ErrorMessage name='password' className={styles.error} />
                  </div>
                  <Field type='password' name='password' placeholder='**********' />
                  <p>Password must contain at least four characters.</p>
                  <p>A strong password contains a combination of letters, numbers and symbols.</p>
                </div>
              </div>
              <div className={styles.confirmPassword}>
                <div className={styles.formControl}>
                  <span>Confirm password</span>
                  <div className={styles.error}>
                    <ErrorMessage name='confirmPassword' className={styles.error} />
                  </div>
                  <Field type='password' name='confirmPassword' placeholder='**********' />
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.loginButton} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Create account'}
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

export default RegistrationForm
