import styles from './form-control.module.scss'
import { ErrorMessage, Field } from 'formik'

type FormControlProps = {
  name: string
}

const FormControl: React.FC<FormControlProps> = ({ name }) => {
  return (
    <div className={styles.formControl}>
      <span>{name.charAt(0).toLocaleUpperCase() + name.slice(1)}</span>
      <Field type='text' name={name} />
      <div className={styles.error}>
        <ErrorMessage name={name} className={styles.error} />
      </div>
    </div>
  )
}

export default FormControl
