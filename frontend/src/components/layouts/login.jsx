import React, { useState } from "react";
import "../../styles/login.css";
import App from "../../App";

const Login = () => {
  const [formData, setFormData] = useState({
    userType: "none",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // You can connect API here
  };

  return (
    <section>
      <div className="container">
        <h2>LOGIN</h2>
        <p>Continue your journey!!</p>

        <form onSubmit={handleSubmit}>
          <select
            className="user"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="none">Choose User Type</option>
            <option value="Student">Student</option>
            <option value="Administrator">Administrator</option>
          </select>

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <br /><br />

          <button type="submit">Login</button>
        </form>

        <p>
          Not registered? <Link to='/signup'>Create an account</Link>
        </p>
      </div>
    </section>
  );
};



const Signup = () => {
  const [formData, setFormData] = useState({
    userType: "none",
    name: "",
    rollNumber: "",
    collegeId: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // Connect backend API here
  };

  return (
    <section>
      <div className="container">
        <h2>SignUp</h2>
        <p>Start your Learning journey!!</p>

        <form onSubmit={handleSubmit}>
          <select
            className="user"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="none">Choose User Type</option>
            <option value="Student">Student</option>
            <option value="Administrator">Administrator</option>
          </select>

          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="collegeId">College Id:</label>
          <input
            type="text"
            id="collegeId"
            name="collegeId"
            placeholder="College Id"
            value={formData.collegeId}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Create Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">SignUp</button>
        </form>

        <p>
          Already have an account? <button id="alreadyLogin" onClick={()=>{
            App.render(<Login/>)
          }}>Login</button>
        </p>  
      </div>
    </section>
  );
};

export {Signup};

export default Login;