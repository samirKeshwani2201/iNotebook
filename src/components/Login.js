import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: " ", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json()
        console.log(json)
        if (json.success) {
            // Save the auth token and redirect 
            localStorage.setItem('token', json.authToken)
            props.showAlert("Logged in successfully ", "success")
            navigate("/");

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
        <div className='mt-2'>
            <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input value={credentials.email} onChange={onChange} type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" />

                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input value={credentials.password} onChange={onChange} type="password" className="form-control" name='password' id="password" />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login