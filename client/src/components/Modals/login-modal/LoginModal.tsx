import React, { useEffect } from 'react'
import styles from './LoginModal.module.scss'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useActions, useAppDispatch, useAppSelector } from '../../../hoooks/redux'
import { login } from '../../../store/slices/auth/ActionCreators.auth'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

const LoginModal: React.FC = () => {
  const { isLogModalOpen } = useAppSelector((state) => state.authReducer)
  const { setLogModalOpen, setRegModalOpen } = useActions()

  useEffect(() => {
    if (isLogModalOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLogModalOpen])

  return (
    <div className={styles.modal} onClick={() => setLogModalOpen(false)}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1>SIGN IN</h1>
        </div>
        <div className={styles.body}>
          <LoginForm setLogModalActive={setLogModalOpen} setRegModalActive={setRegModalOpen} />
        </div>
      </div>
    </div>
  )
}

type LoginFormPropsType = {
  setLogModalActive: ActionCreatorWithPayload<boolean, 'auth/setLogModalOpen'>
  setRegModalActive: ActionCreatorWithPayload<boolean, 'auth/setRegModalOpen'>
}

const LoginForm: React.FC<LoginFormPropsType> = ({ setLogModalActive, setRegModalActive }) => {
  const dispatch = useAppDispatch()

  const initialValues = {
    email: '',
    password: '',
    remember: false,
  }

  type InitialValuesType = typeof initialValues

  type FormikType = {
    setSubmitting: (arg0: boolean) => void
    setStatus: (arg0: string) => void
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(login({ ...values, setStatus, setSubmitting }))
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required field'),
    password: Yup.string()
      .min(4, 'Password should be longer than 3 symbols')
      .max(30, 'Password should be shorter than 30 symbols')
      .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
      .required('Required field'),
  })

  const handleCreateClick = () => {
    setLogModalActive(false)
    setRegModalActive(true)
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <>
            <Form>
              <div className={styles.email}>
                <div className={styles.formControl}>
                  <span>Email address</span>
                  <div className={styles.error}>
                    <ErrorMessage name='email' className={styles.error} />
                  </div>
                  <Field type='email' name='email' placeholder='address@gmail.com' />
                </div>
              </div>
              <div className={styles.password}>
                <div className={styles.formControl}>
                  <span>Password</span>
                  <div className={styles.error}>
                    <ErrorMessage name='password' className={styles.error} />
                  </div>
                  <Field type='password' name='password' placeholder='***********' />
                </div>
              </div>
              <div className={styles.remember}>
                <div className={styles.formControl}>
                  <Field type='checkbox' name='remember' />
                  <div className={styles.error}>
                    <ErrorMessage name='remember' className={styles.error} />
                  </div>
                  <span>Remember Me</span>
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.loginButton} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Continue'}
                </button>
              </div>
              <div className={styles.status}>{formik.status}</div>
            </Form>
            <div className={styles.line}>
              <h2>
                <span>Don't have an account yet?</span>
              </h2>
            </div>
            <div className={styles.create}>
              <button className={styles.registationButton} onClick={handleCreateClick} disabled={formik.isSubmitting}>
                {'Create your Best Product account'}
              </button>
            </div>
          </>
        )
      }}
    </Formik>
  )
}

export default LoginModal
