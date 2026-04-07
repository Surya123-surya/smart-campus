import SideBar from './components/layouts/sideBar.jsx'
import NavBar from './components/layouts/navBar.jsx'
import { Outlet } from "react-router-dom";


function Layouts() {
  return (
    <div className="main">
      <div className="SideBar"><SideBar /></div>
      <div className="hero">
        <div className="NavBar"><NavBar /></div>
        <div className="Model">
          ...
        </div>
      </div>
    </div>
  )
}

export default Layouts;