import { useEffect, useState } from 'react'
import styles from './price.module.scss'
import { ReactComponent as FilterArrowIcon } from 'assets/icons/other/arrows/filter-arrow-top.svg'
import { ReactComponent as PriceDividerIcon } from 'assets/icons/other/price-dephis-icon.svg'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useSearchParams } from 'react-router-dom'

type PropsType = {
  priceRange: string[]
  isReset: boolean
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}

const Price: React.FC<PropsType> = ({ priceRange, isReset, setReset }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [price, setPrice] = useState<string[]>(priceRange)
  const [isPriceDropdownOpen, setPriceDropdownOpen] = useState<boolean>(false)

  useEffect(() => {
    const price = searchParams.get('price')

    if (price) {
      setPrice(price.split('-'))
    } else {
      setPrice(priceRange)
    }

    if (isReset) {
      setPriceDropdownOpen(false)
      setReset(false)
    }
  }, [searchParams, priceRange])

  const initialValues = {
    low: price.length > 0 ? price[0] : '10',
    high: price.length > 0 ? price[1] : '1500',
  }

  type InitialValuesType = typeof initialValues

  const validationSchema = Yup.object({
    low: Yup.string()
      .min(3, 'Price should be longer than 2 symbols')
      .max(10, 'Price should be shorter than 10 symbols')
      .matches(/^[0-9]+$/, 'Must be only digits'),
    high: Yup.string()
      .min(3, 'Price should be longer than 2 symbols')
      .max(10, 'Price should be shorter than 10 symbols')
      .matches(/^[0-9]+$/, 'Must be only digits'),
  })

  const onSubmit = (values: InitialValuesType) => {
    searchParams.set('price', `${values.low}-${values.high}`)
    setSearchParams(searchParams)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  })

  return (
    <div className={styles.price}>
      <div
        className={isPriceDropdownOpen ? `${styles.title} ${styles.active}` : `${styles.title}`}
        onClick={() => setPriceDropdownOpen((prev) => !prev)}
      >
        <FilterArrowIcon className={styles.arrow__icon} />
        <span>Price</span>
      </div>
      {isPriceDropdownOpen && (
        <div className={styles.control}>
          <form onSubmit={formik.handleSubmit} className={styles.fields}>
            <input type='text' name='low' autoComplete='off' value={formik.values.low} onChange={formik.handleChange} />
            <PriceDividerIcon />
            <input type='text' name='high' autoComplete='off' value={formik.values.high} onChange={formik.handleChange} />
          </form>
          <button type='submit' className={styles.setPrice} disabled={!formik.isValid && formik.isSubmitting} onClick={() => onSubmit(formik.values)}>
            OK
          </button>
        </div>
      )}
      <hr className={isPriceDropdownOpen ? `${styles.opened}` : `${styles.closed}`}></hr>
    </div>
  )
}

export default Price
