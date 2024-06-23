import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import logoSchedule from '/Images/logo-schedule.png';
import './style.css';



function Completed () {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
        .then(res => {
            navigate('/login');
        })
        .catch(err => console.log(err));
    };


    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        axios.get('http://localhost:3000/auth/completedTasks')
            .then(res => {
                setCompletedTasks(res.data.tasks);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/auth/users-data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);
    if (!userData) {
        return <div>Loading...</div>; 
    }
  
     return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <Link to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                            <img src={logoSchedule} alt="Logo" width="150" height="150" className="me-2" />
                        </Link>
                        <div>
                            <h5>{userData.username}</h5>
                        </div>
                        <br/>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/dashboard" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white ">
                                    <i className="fs-5 bi-list-task"></i><span className="ms-1 d-sm-inline">All Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/completed" className="nav-link px-0 align-middle custom-active-link">
                                <i class="fs-5 bi bi-clipboard-check"></i> <span className="ms-1 d-sm-inline">Completed Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/archive" className="nav-link px-0 align-middle text-white ">
                                <i class="fs-5 bi bi-clipboard-heart"> </i> <span className="ms-1 d-sm-inline">Archive Task</span> </Link>
                            </li>
                           
                            <hr />
                            <li onClick={handleLogout}>
                                <a href="#" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-power"></i> <span className="ms-1 d-sm-inline">Logout</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="main col p-2 m-0">
                    <div className='p-2 d-flex justify-content-between shadow'>
                        <button className="btn  d-md-none" onClick={handleToggleSidebar}>
                            <i className="fs-5 bi bi-list"></i>
                        </button>
                        <h4 className="text-center align-items-center">Completed Task</h4>
                    </div>
                    <Outlet />
                   
                        <div className="p-4 card-bg">
                    {loading ? (
                        <p>Loading...</p>
                    ) : completedTasks.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                            {completedTasks.map(task => (
                                <div key={task.id} className="col mb-4">
                                    <div className="card card-me">
                                        <div className="card-body">
                                            <h5 className="card-title">{task.title}</h5>
                                            <p className="card-text">{task.content}</p>
                                            <p className="card-subtitle mb-2 text-muted">Subject: {task.subject_code}</p>
                                            <p className="card-subtitle mb-2 text-muted">Instructor: {task.instructor_name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <img src="/Images/file.png" alt="No tasks" />
                            <p>No completed tasks yet.</p>
                        </div>
                    )}
                        </div>


                       
                        </div>
                    </div>

           
        </div>
    );
}

export default Completed;
