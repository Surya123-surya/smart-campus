import './styles/App.css'
import { Signup } from './../src/components/layouts/login'
import Login from './../src/components/layouts/login'
import Layouts from './../src/layouts'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      

      <Routes>
        <Route path='/' element={<Layouts/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </>
  )
}

export default App