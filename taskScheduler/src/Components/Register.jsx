
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import logoSchedule from '/Images/logo-schedule.png';

const Register = () => {
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        axios.post('http://localhost:3000/auth/register', values)
            .then(result => {
                if(result.data.registerStatus){
                    navigate('/login')
                } else{
                    setError(result.data.Error)
                }
                
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 registerPage'>
    <div className='p-3 rounded w-40 w-md-75 w-lg-30 w-xl-25 border loginForm'>
        <img src={logoSchedule} alt="Logo" width="100" height="100" className="mx-auto d-block" />
        <h3 className='text-center mb-3'>Sign up</h3>
        
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <input type="email" id="email" autoComplete='off' placeholder='Enter Email'
                   onChange={(e) => setValues({...values, email:e.target.value})} className='form-control rounded-5' />
            </div>
            <div className='mb-3'>
                <input type="text" id="username" autoComplete='off' placeholder='Enter Username'
                   onChange={(e) => setValues({...values, username:e.target.value})} className='form-control rounded-5' />
            </div>

            <div className='mb-3'>
                <input type="password" id="password" placeholder='Enter Password'
                    onChange={(e) => setValues({...values, password:e.target.value})} className='form-control rounded-5' />
            </div>
            <div className='mb-3'>
                <input type="password" id="confirmPassword" placeholder='Confirm Password'
                    onChange={(e) => setValues({...values, confirmPassword:e.target.value})} className='form-control rounded-5' />
            </div>
            <div className="d-flex justify-content-center">
                <button type="submit" className='btn btn-success w-50 rounded-5 mb-3'>Register</button>
            </div>
            <div className='mb-3'>
                    <p className="text-center">Already have an account? <a href="/login" className='text-success'>Sign in</a></p>
                </div>
        </form>
    </div>
</div>

    );
};

export default Register;
