import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      {/* <Route path='/home' element={<Home />} />
      <Route path='/favorite' element={<Favorite />} />
      <Route path='/details' element={<Details />} /> */}
    </Routes>
  )
}

export default AppRouter
