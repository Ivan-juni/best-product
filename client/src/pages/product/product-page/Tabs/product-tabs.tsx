import { useState } from 'react'
import styles from './product-tabs.module.scss'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Characteristics from './characteristics/characteristics'
import { IProduct } from 'models/product.model'
import Description from './description/description'
import Comments from './comments/comments'
import PriceDynamics from './price-dynamics/price-dynamics'
import { IPriceDynamics } from 'models/stats.model'
import { getCommentsState } from 'store/slices/comments/comments.selectors'
import { useAppSelector } from 'hooks/redux'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const extraStyles = {
  tabPanelBox: { p: 4 },
  tabs: {
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
  },
  mainBox: {
    borderBottom: 0,
    overflow: 'auto',
  },
  tabIndicator: { backgroundColor: '#766ED3' },
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={extraStyles.tabPanelBox}>
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
  const [value, setValue] = useState<number>(0)
  const { total } = useAppSelector(getCommentsState)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={styles.wrapper}>
      <Box sx={extraStyles.mainBox}>
        <Tabs value={value} variant='scrollable' onChange={handleChange} TabIndicatorProps={{ sx: extraStyles.tabIndicator }} sx={extraStyles.tabs}>
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
