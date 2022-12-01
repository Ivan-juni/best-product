import React from 'react'
import './App.scss'
import AppRouter from './AppRouter'

function App() {
  return (
    <div className='wrapper'>
      <header>{/* <Header /> */}</header>
      <main>
        {/* <Navbar /> */}
        <AppRouter />
      </main>
      <footer>{/* <Footer /> */}</footer>
    </div>
  )
}

export default App
