import { Routes, Route, Navigate } from 'react-router-dom'
import ProductsPage from './pages/Products/ProductsPage'
import Favorites from './pages/Favorites/Favorites'
import Home from './pages/Home/Home'
import Product from './pages/Product/ProductContainer'
import Profile from './pages/Profile/Profile'
import NotFound from './components/not-found/NotFound'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/favorites' element={<Favorites />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/product' element={<Product />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
