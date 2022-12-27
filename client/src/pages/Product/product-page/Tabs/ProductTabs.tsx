import React, { useState } from 'react'
import styles from './ProductTabs.module.scss'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Characteristics from './Characteristics/Characteristics'
import { IProduct } from '../../../../models/IProduct.model'
import Description from './Description/Description'
import Comments from './Comments/Comments'
import { useAppSelector } from '../../../../hoooks/redux'
import PriceDynamics from './Price-Dynamics/PriceDynamics'
import { IPriceDynamics } from '../../../../models/IStats.model'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 4 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

type PropsType = {
  product: IProduct
  priceDynamics: IPriceDynamics[]
  productId: number
  isEditMode: boolean
}

const ProductTabs: React.FC<PropsType> = ({ product, priceDynamics, productId, isEditMode }) => {
  const [value, setValue] = useState(0)
  const { total } = useAppSelector((state) => state.commentsReducer)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={styles.wrapper}>
      <Box
        sx={{
          borderBottom: 0,
          overflow: 'auto',
        }}
      >
        <Tabs
          value={value}
          variant='scrollable'
          onChange={handleChange}
          TabIndicatorProps={{ sx: { backgroundColor: '#766ED3' } }}
          sx={{
            '.MuiTabs-flexContainer': {
              justifyContent: 'space-between',
              maxWidth: '1038px',
              margin: '0 auto',
            },
            '.MuiTabs-indicator': {
              display: 'none',
            },
            '& button': {
              color: '#000000',
              fontFamily: 'Inter',
              fontSize: '24px',
              textTransform: 'none',
              lineHeight: '29px',
              fontWeight: '300',
              letterSpacing: '0',
              padding: '18px 27px',
              transition: 'all 0.3s ease-out',
            },
            '& button:hover': { transition: '0.3s', opacity: 1, color: '#766ED3' },
            '& button:active': { color: '#766ED3', background: '#766ED3', borderRadius: '10px' },
            '& button:focus': { color: '#766ED3', background: '#766ED3', borderRadius: '10px' },
            '& button.Mui-selected': {
              border: 'none',
              color: '#fff',
              background: '#766ED3',
              borderRadius: '10px',
              padding: '18px 27px',
              outline: 'none',
            },
          }}
        >
          <Tab label='Description' {...a11yProps(0)} />
          <Tab label='Characteristics' {...a11yProps(1)} />
          <Tab label={`Comments (${total})`} {...a11yProps(2)} />
          <Tab label='Price Dynamics' {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Description product={product} isEditMode={isEditMode} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Characteristics product={product} isEditMode={isEditMode} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Comments productId={productId} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PriceDynamics priceDynamics={priceDynamics} />
      </TabPanel>
    </div>
  )
}

export default ProductTabs
