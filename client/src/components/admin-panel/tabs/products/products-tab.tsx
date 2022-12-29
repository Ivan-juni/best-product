import { useEffect } from 'react'
import styles from './products-tab.module.scss'
import ProductMini from 'components/products/product-mini/product-mini'
import ProductsMenu from './products-menu/products-menu'
import { ReactComponent as EditIcon } from 'assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/other/delete-icon.svg'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteProduct, fetchProducts } from 'store/slices/product/product.action-creators'
import Preloader from 'components/common/preloader/preloader'
import { IProduct } from 'models/product.model'
import Paginator from 'components/common/paginator/paginator'
import { NavLink, useNavigate } from 'react-router-dom'
import AddProductForm from './add-product/add-product-form'
import { fetchCategories } from 'store/slices/categories/categories.action-creators'
import { showProductHandler } from 'utils/show-product-handler'
import { getProductState } from 'store/slices/product/product.selectors'

const ProductsTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { products, isLoading, total, page, limit } = useAppSelector(getProductState)

  const { setProductsPage, setEditMode, setProductId } = useActions()

  useEffect(() => {
    dispatch(fetchProducts({ page: page, limit: 6 }))
    dispatch(fetchCategories({}))
  }, [page])

  const editProductHandler = (id: number) => {
    setEditMode(true)
    dispatch(fetchProducts({ id }))
  }

  const deleteProductHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
    e.stopPropagation()
    dispatch(deleteProduct({ id }))
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.products__fetch}>
        <h2>Products</h2>
        <div className={styles.body}>
          <ProductsMenu />
          <div className={isLoading ? styles.loading : styles.items}>
            {isLoading ? (
              <Preloader />
            ) : (
              products.map((product: IProduct) => (
                <div className={styles.item} key={product.id} onClick={() => showProductHandler(product.id, navigate, setProductId)}>
                  <ProductMini product={product} />
                  <div className={styles.menu}>
                    <NavLink to={`/product?productId=${product.id}`}>
                      <EditIcon onClick={() => editProductHandler(product.id)} />
                    </NavLink>
                    <DeleteIcon className={styles.deleteIcon} onClick={(e) => deleteProductHandler(e, product.id)} />
                  </div>
                </div>
              ))
            )}
            {products.length === 0 && !isLoading && (
              <div className={styles.noProducts}>
                <h1>No products...</h1>
              </div>
            )}
          </div>
          <div className={styles.pagination}>
            <Paginator total={total} page={page} setPage={setProductsPage} limit={limit} />
          </div>
        </div>
      </section>
      <section className={styles.products__add}>
        <h2>Add product</h2>
        <div className={styles.body}>
          <AddProductForm />
        </div>
      </section>
    </div>
  )
}

export default ProductsTab
