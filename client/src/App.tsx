import React, { useEffect, useState } from 'react'
import './App.scss'
import AppRouter from './AppRouter'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import { useAppDispatch } from './hoooks/redux'
import { checkAuth } from './store/slices/auth/ActionCreators.auth'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const [authOpen, setAuthOpen] = useState(false)

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
