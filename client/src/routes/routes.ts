import ProductsPage from 'pages/products/products-page'
import Favorites from 'pages/favorites/favorites'
import Home from 'pages/home/home'
import Product from 'pages/product/product-container'
import Profile from 'pages/profile/profile'
import NotFound from 'components/not-found/not-found'

export const routes = [
  {
    component: Home,
    path: '/',
  },
  {
    component: Home,
    path: '/home',
  },
  {
    component: Favorites,
    path: '/favorites',
  },
  {
    component: Profile,
    path: '/profile',
  },
  {
    component: Product,
    path: '/product',
  },
  {
    component: ProductsPage,
    path: '/products',
  },
  {
    component: NotFound,
    path: '*',
  },
]
