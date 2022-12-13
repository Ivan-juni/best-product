import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Favorites from './pages/Favorites/Favorites'
import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import Profile from './pages/Profile/Profile'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/favorites' element={<Favorites />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/product' element={<Product />} />
      {/* <Route path='/products' element={<Products />} /> */}
    </Routes>
  )
}

export default AppRouter