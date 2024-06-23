import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoSchedule from '/Images/logo-schedule.png';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/login', values)
            .then(result => {
                console.log('Login success:', result); 
                if (result.data.loginStatus) {
                    const token = result.data.token;
                    localStorage.setItem('token', token);
                    navigate('/Dashboard');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.error('Login error:', err); 
                setError('An error occurred while logging in. Please try again.'); 
            });
    };
    
    


    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded  w-md-75 w-lg-50 w-xl-25 border loginForm'>
            <img src={logoSchedule} alt="Logo" width="100" height="100" className="mx-auto d-block" />
            <h3 className='text-center'>Sign in to your account</h3>
            <br />
            <div className='text-center text-warning'>
                {error && error}
            </div>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <input type="email" id="email" autoComplete='off' placeholder='Enter Email'
                           onChange={(e) => setValues({...values, email:e.target.value})} className='form-control rounded-5' />
                </div>
                <div className='mb-3'>
                    <input type="password" id="password" placeholder='Enter Password'
                           onChange={(e) => setValues({...values, password:e.target.value})} className='form-control rounded-5' />
                </div>
                <div className="d-flex justify-content-center">
                        <button type="submit" className='btn btn-success w-50 rounded-5 mb-3'>Login</button>
                    </div>

                <div className='mb-3'>
                    <p className="text-center">Don't have an account? <a href="/register" className='text-success'>Register</a></p>
                </div>
            </form>
        </div>
    </div>
    
    );
};

export default Login;
