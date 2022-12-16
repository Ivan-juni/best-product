import React, { useState } from 'react'
import styles from './Category.module.scss'
import { useAppDispatch } from '../../../../../hoooks/redux'
import { ReactComponent as DeleteIcon } from '../../../../../assets/icons/other/delete-icon.svg'
import { ICategory } from '../../../../../models/ICategory'
import { deleteCategory, updateCategory } from '../../../../../store/slices/categories/ActionCreators.categories'

type PropsType = {
  category: ICategory
  allCategories: ICategory[]
}

const Category: React.FC<PropsType> = ({ category, allCategories }) => {
  const dispatch = useAppDispatch()

  const [editMode, setEditMode] = useState(false)

  const deleteClickHandler = () => {
    dispatch(deleteCategory({ id: category.id }))
  }

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    setEditMode(false)
    dispatch(updateCategory({ id: category.id, name: e.currentTarget.value }))
  }

  const changeParentHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateCategory({ id: category.id, parent: +e.target.value }))
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.deleteButton} onClick={deleteClickHandler}>
        <DeleteIcon />
      </button>
      <div className={styles.info}>
        <ul>
          <li>
            <span>Id:</span> <span>{category.id}</span>
          </li>
          <li>
            <span>Name:</span>{' '}
            <span>
              {editMode ? (
                <input
                  type='text'
                  defaultValue={category.name}
                  onBlur={(e) => {
                    changeNameHandler(e)
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      changeNameHandler(e)
                    }
                  }}
                  autoFocus={true}
                />
              ) : (
                <span onDoubleClick={() => setEditMode(true)}>{category.name}</span>
              )}
            </span>
          </li>
          <li>
            <span>Parent:</span>
            <span>
              <select name='role' id='role' defaultValue={category.parent} onChange={(e) => changeParentHandler(e)}>
                <option value='0'>0</option>
                {allCategories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Category
