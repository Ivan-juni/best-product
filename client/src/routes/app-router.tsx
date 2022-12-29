import { Routes, Route, Navigate } from 'react-router-dom'
import { routes } from './routes'

const routeComponents = routes.map((route) => {
  if (route.path === '/') {
    return <Route key={route.path} path={route.path} element={<Navigate to='/home' />} />
  } else {
    return <Route key={route.path} path={route.path} element={<route.component />} />
  }
})

const AppRouter = () => {
  return <Routes>{routeComponents}</Routes>
}

export default AppRouter
