import { FormikType } from '../../models/Formik.model'

export const errorLogic = (error: any, { setSubmitting, setStatus }: FormikType) => {
  console.log(error.response?.data?.message)
  if (setSubmitting && setStatus) {
    setStatus(error.response?.data?.message)
    setSubmitting(false)
  }
}
