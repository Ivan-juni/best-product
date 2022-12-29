import styles from './registration-modal.module.scss'
import { useActions } from 'hooks/redux'
import RegistrationForm from './registration-form/registration-form'

const RegistrationModal: React.FC = () => {
  const { setRegModalOpen } = useActions()

  return (
    <div className={styles.modal} onClick={() => setRegModalOpen(false)}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1>SIGN UP</h1>
        </div>
        <div className={styles.body}>
          <RegistrationForm />
        </div>
      </div>
    </div>
  )
}

export default RegistrationModal
