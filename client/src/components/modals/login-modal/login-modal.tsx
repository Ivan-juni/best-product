import { useEffect } from 'react'
import styles from './login-modal.module.scss'
import { useActions, useAppSelector } from 'hooks/redux'
import LoginForm from './login-form/login-form'
import { getAuthState } from 'store/slices/auth/auth.selectors'

const LoginModal: React.FC = () => {
  const { isLogModalOpen } = useAppSelector(getAuthState)
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
