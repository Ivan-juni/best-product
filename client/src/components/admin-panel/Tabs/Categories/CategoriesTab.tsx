import React, { useEffect, useState } from 'react'
import Paginator from '../../../Common/Paginator/Paginator'
import Preloader from '../../../Common/Preloader/Preloader'
import { useActions, useAppDispatch, useAppSelector } from '../../../../hoooks/redux'
import { ICategory } from '../../../../models/ICategory'
import { fetchCategories } from '../../../../store/slices/categories/ActionCreators.categories'
import AddCategory from './add-category/AddCategory'
import CategoriesMenu from './categories-menu/CategoriesMenu'
import styles from './CategoriesTab.module.scss'
import Category from './Category/Category'

const CategoriesTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, categories, allCategories, page, total } = useAppSelector((state) => state.categoriesReducer)

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
