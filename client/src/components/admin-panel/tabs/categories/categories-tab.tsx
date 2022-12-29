import React, { useEffect } from 'react'
import Paginator from 'components/common/paginator/paginator'
import Preloader from 'components/common/preloader/preloader'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { ICategory } from 'models/category.model'
import { fetchCategories } from 'store/slices/categories/categories.action-creators'
import AddCategory from './add-category/add-category'
import CategoriesMenu from './categories-menu/categories-menu'
import styles from './categories-tab.module.scss'
import Category from './category/category'
import { getCategoriesState } from 'store/slices/categories/categories.selectors'

const CategoriesTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, categories, allCategories, page, total } = useAppSelector(getCategoriesState)

  // pagination
  const { setCategoriesPage } = useActions()

  useEffect(() => {
    // pagination
    dispatch(fetchCategories({ page, limit: 4 }))
  }, [page])

  return (
    <section className={styles.categories}>
      <h2>Categories</h2>
      <div className={styles.body}>
        <CategoriesMenu />
        <div className={isLoading ? styles.loading : styles.items}>
          {isLoading ? (
            <Preloader />
          ) : (
            categories.map((category: ICategory) => <Category key={category.id} category={category} allCategories={allCategories} />)
          )}
          {categories.length === 0 && !isLoading && (
            <div className={styles.noItems}>
              <h1>No categories...</h1>
            </div>
          )}
        </div>
        <div className={styles.pagination}>
          <Paginator total={total} page={page} setPage={setCategoriesPage} limit={4} />
        </div>
      </div>
      <AddCategory />
    </section>
  )
}

export default CategoriesTab
