import React, { useEffect, useState } from 'react'
import './App.scss'
import AppRouter from './routes/app-router'
import Footer from './components/footer/footer'
import Header from './components/header/header'
import Navbar from './components/navbar/navbar'
import { useAppDispatch } from './hooks/redux'
import { checkAuth } from './store/slices/auth/auth.action-creators'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const [authOpen, setAuthOpen] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
  }, [])

  return (
    <div className='wrapper' onClick={() => setAuthOpen(false)}>
      <header>
        <Header authOpen={authOpen} setAuthOpen={setAuthOpen} />
      </header>
      <main>
        <div className='navbar'>
          <Navbar />
        </div>
        <div className='content'>
          <AppRouter />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default App
