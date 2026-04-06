import '../../styles/navBar.css'
import logo from '../../assets/aulogo.png'
import services from '../../assets/services.png'
import navigate from '../../assets/navigate.png'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
function NavBar(){
    return (
        <>
        <div className="navBar">
            <div className="nav_items">
                <img src={logo} id='logo' alt="logo" />
                <span>ANDHRA UNIVERSITY</span>
             </div>
            <div className="nav_items">
                <img src={services} className='navLogo' alt='services'/>
                <span>SERVICES</span>
            </div>
            <div className="nav_items">
                 <img src={navigate} className='navLogo' alt='services'/>
                 <span>NAVIGATE</span>
            </div>
            <div className="nav_items">
                <img src={avatar} className='navLogo' alt='services'/>
                <Link to='/login'>LOGIN</Link>
            </div>
        </div>
        </>
    )   
}

export default NavBar