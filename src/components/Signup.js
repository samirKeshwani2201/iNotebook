import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: " ", password: "", cpassword: "" })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const json = await response.json()
    console.log(json)
    if (json.success) {
      // Save the auth token and redirect 
      localStorage.setItem('token', json.authToken)
      navigate("/");
      props.showAlert("Account created successfully ", "success")

    }

    else {
      props.showAlert("Invalid credentials ", "danger")
    }


  }

  const onChange = (e) => {
    // Spread operator ,jo bhi value note ke andar hai voh to rahe he lekinjo properties aage likhi ja rahi hai inko add ya overwrite kardo
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }


  return (
    <div className='container mt-2'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name </label>
          <input type="text" name='name' className="form-control" onChange={onChange} id="name" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name='email' className="form-control" onChange={onChange} id="email" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name='password' className="form-control" required minLength={5} onChange={onChange} id="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" name='cpassword' className="form-label"> Confirm Password</label>
          <input type="password" className="form-control" onChange={onChange} required minLength={5} id="cpassword" />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup   