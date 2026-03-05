import '../../styles/navBar.css'
import logo from '../../assets/aulogo.png'
function NavBar(){
    return (
        <>
        <div className="navBar">
            <div className="nav_items"><img src={logo} id='logo' alt="logo" /></div>
            <div className="nav_items">SERVICES</div>
            <div className="nav_items">NAVIGATION</div>
            <div className="nav_items">surya</div>
        </div>
        </>
    )
}

export default NavBar