import React, { useEffect } from 'react'
import ProductMini from '../../../Products/product-mini/ProductMini'
import ProductsMenu from './products-menu/ProductsMenu'
import { ReactComponent as EditIcon } from '../../../../assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from '../../../../assets/icons/other/delete-icon.svg'
import styles from './ProductsTab.module.scss'
import { useActions, useAppDispatch, useAppSelector } from '../../../../hoooks/redux'
import { deleteProduct, fetchProducts } from '../../../../store/slices/product/ActionCreators.product'
import Preloader from '../../../Common/Preloader/Preloader'
import { IProduct } from '../../../../models/IProduct.model'
import Paginator from '../../../Common/Paginator/Paginator'
import { NavLink, useNavigate } from 'react-router-dom'
import AddProductForm from './add-product/AddProductForm'
import { fetchCategories } from '../../../../store/slices/categories/ActionCreators.categories'
import { showProductHandler } from '../../../../utils/show-product-handler'

const ProductsTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { products, isLoading, total, page, limit } = useAppSelector((state) => state.productReducer)

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
