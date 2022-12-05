import React, { useState } from 'react'
import styles from './Dropdown.module.scss'
import { ReactComponent as FilterArrowIcon } from '../../../../assets/icons/other/arrows/filter-arrow-bottom.svg'

type PropsType = {
  title: string
  items: Array<string>
  type: 'checkbox' | 'radio'
}

const Dropdown: React.FC<PropsType> = ({ title, items, type }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [isChecked, setChecked] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //!todo тут будет логика по отображению товаров
    e.target.checked = !e.target.checked
  }

  return (
    <>
      <div className={styles.wrapper__dropdown}>
        <div
          className={
            isDropdownOpen
              ? `${styles.dropdown__title} ${styles.active}`
              : `${styles.dropdown__title}`
          }
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <FilterArrowIcon className={styles.arrow__icon} />
          <span>{title}</span>
        </div>
        {isDropdownOpen && (
          <ul className={styles.dropdown__items}>
            {items.map((item) => (
              <li key={item}>
                <input
                  type={type}
                  className={
                    type == 'radio' ? `${styles.radio}` : `${styles.checkbox}`
                  }
                  id={item}
                  value={item}
                  // checked={isChecked}
                  // onChange={handleChange}
                />
                <label htmlFor={item}>
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default Dropdown
