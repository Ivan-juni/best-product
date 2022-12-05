import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Favorites from './pages/Favorites/Favorites'
import Home from './pages/Home/Home'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/favorites' element={<Favorites />} />
      {/* <Route path='/categories' element={<Categories/>} /> */}
    </Routes>
  )
}

export default AppRouter
