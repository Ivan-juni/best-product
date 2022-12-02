import React from 'react'
import './App.scss'
import AppRouter from './AppRouter'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <div className='wrapper'>
      <header>
        <Header />
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
