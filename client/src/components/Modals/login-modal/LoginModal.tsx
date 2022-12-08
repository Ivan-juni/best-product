import React, { useEffect } from 'react'
import styles from './LoginModal.module.scss'
import { useActions, useAppSelector } from '../../../hoooks/redux'
import LoginForm from './login-form/LoginForm'

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

export default LoginModal
