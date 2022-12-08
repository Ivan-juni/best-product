import React, { useState } from 'react'
import styles from './AdminPanel.module.scss'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import UsersTab from './Tabs/Users/UsersTab'
import ProductsTab from './Tabs/Products/ProductsTab'

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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

const AdminPanel: React.FC = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={styles.wrapper}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ sx: { backgroundColor: '#766ED3' } }}
          sx={{
            '& button': { color: '#435C6B', fontFamily: 'Inter', fontSize: '18px' },
            '& button:hover': { transition: '0.3s', opacity: 0.8 },
            '& button:active': { color: '#766ED3' },
            '& button:focus': { color: '#766ED3' },
            '& button.Mui-selected': { borderColor: '#766ED3', color: '#766ED3' },
          }}
        >
          <Tab label='Users' {...a11yProps(0)} />
          <Tab label='Products' {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UsersTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProductsTab />
      </TabPanel>
    </div>
  )
}

export default AdminPanel
