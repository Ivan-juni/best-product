import { FormikType } from '../../models/Formik.model'
import { ErrorType } from '../../models/IError.model'

export const errorLogic = (error: ErrorType, { setSubmitting, setStatus }: FormikType = {}): string => {
  if (error.response?.data) {
    console.log(error.response.data.message)
    if (setSubmitting && setStatus) {
      setStatus(error.response.data.message)
      setSubmitting(false)
    }
    return error.response.data.message
  } else {
    console.log('Unexpected error')
    if (setSubmitting && setStatus) {
      setStatus('Unexpected error')
      setSubmitting(false)
    }
    return 'Unexpected error'
  }
}
