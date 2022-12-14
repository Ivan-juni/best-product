import styles from './add-category.module.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { FormikType } from 'models/formik.model'
import { addCategory } from 'store/slices/categories/categories.action-creators'
import FormControl from 'components/common/form-control/form-control'
import { getAllCategories } from 'store/slices/categories/categories.selectors'
import { ICategory } from 'models/category.model'

const AddCategoryForm = () => {
  const dispatch = useAppDispatch()

  const categories: ICategory[] = useAppSelector(getAllCategories)

  const initialValues = {
    name: '',
    parent: categories.length > 0 ? `${categories[0].id}` : '',
  }

  type InitialValuesType = {
    name: string
    parent: string
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(addCategory({ setSubmitting, setStatus, name: values.name, parent: +values.parent }))
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name should be longer than 2 symbols').required('Required filed'),
    parent: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Required field')
      .nullable(false),
  })

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className={styles.fields}>
                <FormControl name={'name'} />
                <div className={styles.formControl}>
                  <span>Parent: </span>
                  <Field as='select' name='parent'>
                    <option key={0} value={0}>
                      Without parent
                    </option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                    })}
                  </Field>
                  <div className={styles.error}>
                    <ErrorMessage name='parent' className={styles.error} />
                  </div>
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.changeInfo} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Add category'}
                </button>
              </div>
              <div className={styles.status}>{formik.status}</div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default AddCategoryForm
