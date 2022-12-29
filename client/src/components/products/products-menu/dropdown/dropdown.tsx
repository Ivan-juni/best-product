import { useEffect, useState } from 'react'
import styles from './dropdown.module.scss'
import { ReactComponent as FilterArrowIcon } from 'assets/icons/other/arrows/filter-arrow-top.svg'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

type PropsType = {
  title: string
  isReset: boolean
  setReset: React.Dispatch<React.SetStateAction<boolean>>
  items: Array<string>
  type: 'checkbox' | 'radio'
}

const extraStyles = {
  formControl: {
    '& .css-ahj2mt-MuiTypography-root': {
      fontStyle: 'normal',
      fontSize: '22px',
      lineHeight: '27px',
      display: 'flex',
      alignItems: 'center',
      color: '#524F5E',
      marginLeft: '6px',
    },
  },
}

const Dropdown: React.FC<PropsType> = ({ title, items, type, isReset, setReset }) => {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleClick = (item: string) => {
    const setSearchParam = (name: string, value: string = item) => {
      if (searchParams.has(name)) {
        const paramValue = searchParams.get(name)?.split(',') || []

        if (paramValue.includes(value)) {
          const result = paramValue.filter((v) => v !== value)
          if (result.length !== 0) {
            searchParams.set(name, result.join(','))
          } else {
            if (type === 'checkbox') {
              searchParams.delete(name)
            }
          }
          setSearchParams(searchParams)
        } else {
          if (type === 'checkbox') {
            searchParams.set(name, `${paramValue.join(',')},${value}`)
          } else {
            searchParams.set(name, `${value}`)
          }
          setSearchParams(searchParams)
        }
      } else {
        searchParams.set(name, value)
        setSearchParams(searchParams)
      }
    }

    switch (title) {
      case 'Categories':
        setSearchParam('category')
        break
      case 'Connection method':
        setSearchParam('connectionType')
        break
      case 'Purpose':
        setSearchParam('purpose')
        break
      case 'Microphone':
        setSearchParam('microphone')
        break
      case 'Display':
        setSearchParam('display')
        break
      default:
        break
    }
  }

  const defaultValueHandler = () => {
    const setDefaultValue = (name: string) => {
      if (searchParams.has(name)) {
        const paramValue = searchParams.get(name)?.split(',') || []

        if (paramValue.length > 1) {
          return paramValue.join(',')
        } else if (paramValue.length === 1) {
          return paramValue[0]
        } else {
          return ''
        }
      } else {
        return ''
      }
    }

    switch (title) {
      case 'Categories':
        return setDefaultValue('category')
      case 'Connection method':
        return setDefaultValue('connectionType')
      case 'Purpose':
        return setDefaultValue('purpose')
      case 'Microphone':
        return setDefaultValue('microphone')
      case 'Display':
        return setDefaultValue('display')
      default:
        return ''
    }
  }

  const RadioButtonIcon = ({ checked }: { checked: boolean }) => (
    <svg width='27px' height='27px' viewBox='0 0 24 24' fontSize='27px'>
      <circle cx='50%' cy='50%' r='11px' stroke='#524F5E' strokeWidth='1px' fill='none' />
      {checked && <circle cx='50%' cy='50%' r='8.5px' fill='#766ED3' />}
    </svg>
  )
  const CheckButtonIcon = ({ checked }: { checked: boolean }) => (
    <svg width='33px' height='33px' viewBox='0 0 24 24' fontSize='33px'>
      <rect x='0' y='0' width='24' height='24' stroke='rgba(82, 79, 94, 0.5)' strokeWidth='1px' fill='none' />
      {checked && <rect x='3' y='3' width='18' height='18' fill='#766ED3' />}
    </svg>
  )

  useEffect(() => {
    if (isReset) {
      setDropdownOpen(false)
      setReset(false)
    }
  }, [searchParams])

  return (
    <>
      <div className={styles.wrapper__dropdown}>
        <div className={isDropdownOpen ? `${styles.title} ${styles.active}` : `${styles.title}`} onClick={() => setDropdownOpen((prev) => !prev)}>
          <FilterArrowIcon className={styles.arrow__icon} />
          <span>{title}</span>
        </div>
        {isDropdownOpen && (
          <FormControl className={styles.options}>
            {type === 'radio' ? (
              <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue={defaultValueHandler} name='radio-buttons-group'>
                {items.map((item) => {
                  return (
                    <FormControlLabel
                      value={item}
                      key={item}
                      control={
                        <Radio
                          onClick={() => handleClick(item)}
                          icon={<RadioButtonIcon checked={false} />}
                          checkedIcon={<RadioButtonIcon checked={true} />}
                        />
                      }
                      label={item}
                      sx={extraStyles.formControl}
                    />
                  )
                })}
              </RadioGroup>
            ) : (
              <FormGroup>
                {items.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={defaultValueHandler().split(',').includes(item)}
                          onClick={() => handleClick(item)}
                          icon={<CheckButtonIcon checked={false} />}
                          checkedIcon={<CheckButtonIcon checked={true} />}
                        />
                      }
                      label={item}
                      sx={extraStyles.formControl}
                    />
                  )
                })}
              </FormGroup>
            )}
          </FormControl>
        )}
        <hr></hr>
      </div>
    </>
  )
}

export default Dropdown
