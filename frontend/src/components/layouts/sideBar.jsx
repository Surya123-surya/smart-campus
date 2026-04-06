import {useState} from 'react';
import '../../styles/sideBar.css'
import aulogo from '../../assets/aulogo.png'

function SideBar() {
    const [selectedFrom, setSelectedFrom] = useState("");
    const [selectedTo, setSelectedTo] = useState("");

    const handleChangeFrom = (e) => {
      setSelectedFrom(e.target.value);
      if(e.target.value===""){
        console.log('plz select from location')
      }
      else
      console.log("selected from: "+e.target.value)
    };
    const handleChangeTo = (e) => {
      setSelectedTo(e.target.value);
      if(e.target.value===""){
        console.log('plz select to location')
      }
      else
      console.log("selected to: "+e.target.value)
    };
    const navigate= (e)=>{
        console.log('navigate from '+ selectedFrom+' to '+selectedTo)
    }
    const scanQR= (e)=>{
        console.log('plz scan QR code ')
    }
    
    return(
        <>
        <div className="sideBar">   
            <div className="auLogo">    
                <img id='aulogo' src={aulogo} alt="aulogo" />
            </div>
            <div className="sideMain">
                <div className="side-Item">
                    <h4>Select From: </h4>
                    <select value={selectedFrom} onChange={handleChangeFrom} className="dropdown">
                        <option value="">Select From</option>
                        <option value="mainGate">mainGate</option>
                        <option value="a-Hub">a-hub</option>
                        <option value="block-1">block-1</option>
                        <option value="block-2">block-2</option>
                        <option value="block-3">block-3</option>
                        <option value="block-4">block-4</option>
                        <option value="block-5">block-5</option>
                        <option value="block-6">block-6</option>
                        <option value="block-7">block-7</option>
                        <option value="Girls Hostel">Girls Hostel</option>
                    </select>

                    {/* {selectedFrom && <p className="selectedFrom">Selected: {selectedFrom}</p>} */}
                </div>
                <div className="side-Item">
                    <h4>Select To: </h4>
                    <select value={selectedTo} onChange={handleChangeTo} className="dropdown">
                        <option value="">Select To</option>
                        <option value="students">mainGate</option>
                        <option value="faculty">a-hub</option>
                        <option value="services">block-1</option>
                        <option value="navigation">block-2</option>
                        <option value="block-3">block-3</option>
                        <option value="block-4">block-4</option>
                        <option value="block-5">block-5</option>
                        <option value="block-6">block-6</option>
                        <option value="block-7">block-7</option>
                        <option value="Girls Hostel">Girls Hostel</option>
                    </select>

                    {/* {selectedFrom && <p className="selectedFrom">Selected: {selectedFrom}</p>} */}
                </div>
                <div className="sideButton">
                    <button onClick={navigate}>Navigate</button>
                </div>
                <div className="sideButton">
                    <button onClick={scanQR}>Scan QR</button>
                </div>
            </div>
        </div>
        </>
    ) 
}

export default SideBar