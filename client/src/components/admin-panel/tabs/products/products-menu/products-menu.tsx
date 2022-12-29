import { useAppDispatch } from 'hooks/redux'
import styles from './products-menu.module.scss'
import { FormikType } from 'models/formik.model'
import FindMenu from 'components/common/find-menu/find-menu'
import { fetchProducts } from 'store/slices/product/product.action-creators'

const ProductsMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    const { id, ...rest } = values

    dispatch(fetchProducts({ id: values.id ? +values.id : null, setSubmitting, setStatus, ...rest }))
  }

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default ProductsMenu
