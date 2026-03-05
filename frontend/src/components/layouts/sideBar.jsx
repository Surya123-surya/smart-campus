import {useState} from 'react';
import '../../styles/sideBar.css'
import aulogo from '../../assets/aulogo.png'

function SideBar() {
    const [selectedFrom, setSelectedFrom] = useState("");
    const [selectedTo, setSelectedTo] = useState("");

    const handleChangeFrom = (e) => {
      setSelectedFrom(e.target.value);
    };
    const handleChangeTo = (e) => {
      setSelectedTo(e.target.value);
     
    };
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
                    <button >Navigate</button>
                </div>
                <div className="sideButton">
                    <button >Scan QR</button>
                </div>
            </div>
        </div>
        </>
    ) 
}

export default SideBar