import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import NavBar from '../src/components/layouts/navBar'
import SideBar from '../src/components/layouts/sideBar'

function App() {
 

  return (
    <>
   <div className="main">
      <div className="SideBar"><SideBar/></div>
      <div className="hero">
        <div className="NavBar"><NavBar/></div>
        <div className="Model">....</div>
      </div>
   </div>
    </>
  )
}

export default App
