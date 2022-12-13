import React, { useEffect } from 'react'
import ProductMini from '../../../../../components/Products/product-mini/ProductMini'
import CategoriesMenu from './categories-menu/CategoriesMenu'
import ProductsMenu from './products-menu/ProductsMenu'
import { ReactComponent as EditIcon } from '../../../../../assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from '../../../../../assets/icons/other/delete-icon.svg'
import styles from './ProductsTab.module.scss'
import { useActions, useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { deleteProduct, fetchProducts } from '../../../../../store/slices/product/ActionCreators.product'
import Preloader from '../../../../../components/Common/Preloader/Preloader'
import { IProduct } from '../../../../../models/IProduct.model'
import Paginator from '../../../../../components/Common/Paginator/Paginator'
import { NavLink, useNavigate } from 'react-router-dom'

const ProductsTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { products, isLoading, total, limit, page } = useAppSelector((state) => state.productReducer)

  // pagination
  const { setProductsPage, setEditMode, setProductId } = useActions()

  useEffect(() => {
    dispatch(fetchProducts({ page: `${page}`, limit: `${limit}` }))
  }, [page])

  const editProductHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
    // e.stopPropagation()
    setEditMode(true)
    dispatch(fetchProducts({ id: `${id}` }))
  }

  const showProductHandler = (id: number) => {
    // подгружаю продукт теперь на странице продукта
    // dispatch(fetchProducts({ id: `${id}` }))
    setProductId(id)
    navigate(`/product?productId=${id}`)
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.products}>
        <h2>Products</h2>
        <div className={styles.body}>
          <ProductsMenu />
          <div className={isLoading ? styles.loading : styles.items}>
            {isLoading ? (
              <Preloader />
            ) : (
              products.map((product: IProduct) => (
                <div className={styles.item} key={product.id} onClick={() => showProductHandler(product.id)}>
                  <ProductMini product={product} />
                  <div className={styles.menu}>
                    <NavLink to={`/product?productId=${product.id}`}>
                      <EditIcon onClick={(e) => editProductHandler(e, product.id)} />
                    </NavLink>
                    <DeleteIcon onClick={() => dispatch(deleteProduct({ id: product.id }))} />
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
      <section className={styles.categories}>
        <h2>Categories</h2>
        <div className={styles.body}>
          <CategoriesMenu />
        </div>
      </section>
    </div>
  )
}

export default ProductsTab
