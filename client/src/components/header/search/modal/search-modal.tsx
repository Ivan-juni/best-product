import styles from './search-modal.module.scss'
import { useEffect } from 'react'
import ProductMini from 'components/products/product-mini/product-mini'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from 'store/slices/product/product.action-creators'
import { getSearchProducts } from 'store/slices/product/product.selectors'
import { getSearchCategories } from 'store/slices/categories/categories.selectors'
import { IProduct } from 'models/product.model'
import { ICategory } from 'models/category.model'

type PropsType = {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchModal: React.FC<PropsType> = ({ isModalOpen, setModalOpen }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const products: IProduct[] = useAppSelector(getSearchProducts)
  const categories: ICategory[] = useAppSelector(getSearchCategories)

  const { setProductId } = useActions()

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const showCategoryHandler = (name: string) => {
    setModalOpen(false)

    dispatch(fetchProducts({ category: name }))
    navigate(`/products?page=0&limit=9&category=${name}`)
  }

  const showProductHandler = (id: number) => {
    setProductId(id)
    dispatch(fetchProducts({ id }))
    setModalOpen(false)
    navigate(`/product?productId=${id}`)
  }

  return (
    <div className={styles.wrapper} onClick={() => setModalOpen(false)}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.categories}>
          <div className={styles.items}>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  category && (
                    <div key={category.id} className={styles.item} onClick={() => showCategoryHandler(category.name)}>
                      <h3>{category.name}</h3>
                    </div>
                  )
                )
              })}
          </div>
        </div>
        <div className={styles.goods}>
          <h3>Goods</h3>
          <div className={styles.items}>
            {products.length > 0 ? (
              products.map((product) => {
                return (
                  product &&
                  product.characteristics &&
                  product.category && (
                    <div key={product.id} className={styles.item} onClick={() => showProductHandler(product.id)}>
                      <ProductMini product={product} />
                    </div>
                  )
                )
              })
            ) : (
              <div className={styles.noItems}>
                <h2>Products haven't found</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
