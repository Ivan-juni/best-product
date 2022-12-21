import styles from './Search.module.scss'
import { ReactComponent as SearchIcon } from '../../../assets/icons/other/search-icon.svg'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FormikType } from '../../../models/Formik.model'
import { useActions, useAppDispatch } from '../../../hoooks/redux'
import { fetchSearchProducts } from '../../../store/slices/product/ActionCreators.product'
import { fetchSearchCategories } from '../../../store/slices/categories/ActionCreators.categories'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect } from 'react'

type PropsType = {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Search: React.FC<PropsType> = ({ setModalOpen, isModalOpen }) => {
  const dispatch = useAppDispatch()
  const { setSearchProducts, setSearchCategories } = useActions()

  type InitialValuesType = {
    name: string
  }

  const initialValues: InitialValuesType = {
    name: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name should be longer than 2 symbols').max(40, 'Name should be shorter than 40 symbols'),
  })

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(fetchSearchProducts({ name: values.name, setSubmitting, setStatus }))
    dispatch(fetchSearchCategories({ name: values.name, setSubmitting, setStatus }))
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  })

  const debounced = useDebouncedCallback((value: string) => {
    if (value.length > 2) {
      dispatch(fetchSearchProducts({ name: value, setSubmitting: formik.setSubmitting, setStatus: formik.setStatus }))
      dispatch(fetchSearchCategories({ name: value, setSubmitting: formik.setSubmitting, setStatus: formik.setStatus }))
    } else {
      setSearchProducts({ results: [], total: 0 })
      setSearchCategories({ results: [], total: 0 })
    }
  }, 300)

  useEffect(() => {
    if (!isModalOpen) {
      formik.resetForm()
      setSearchProducts({ results: [], total: 0 })
      setSearchCategories({ results: [], total: 0 })
    }
  }, [isModalOpen])

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.search}>
        <SearchIcon className={styles.search__icon} />
        <div className={styles.search__field} onClick={(e) => e.stopPropagation()}>
          {isModalOpen && (
            <>
              <div className={styles.error}>{formik.errors.name}</div>
              <div className={styles.status}>{formik.status}</div>
            </>
          )}
          <input
            type='text'
            name='name'
            className={styles.search__input}
            placeholder='Search'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { name, value } = e.target
              formik.setFieldValue(name, value)
              debounced(value)
            }}
            autoComplete='off'
            onClick={() => setModalOpen(true)}
            value={formik.values.name}
          />
        </div>
      </div>
    </form>
  )
}

export default Search
