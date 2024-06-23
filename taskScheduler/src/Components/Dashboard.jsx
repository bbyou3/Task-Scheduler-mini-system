import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import logoSchedule from '/Images/logo-schedule.png';
import './style.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Dashboard() {
    const navigate = useNavigate();

    //The commented code down there is use to secure the dashboard pero kay naka-encounter ko ug error and dili pa enough akong logic for authentication. So ako pa ni siya gi-comment. Connect ni sa katong gi comment pod nga /users-data sa router sa adminRoute.js
    
    // const [authenticated, setAuthenticated] = useState(false);
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         navigate('/login');
    //         return;
    //     }
    
    //     axios.get('http://localhost:3000/auth/users-data', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //     .then(response => {
    //         if (response.data.authenticated) {
    //             setAuthenticated(true);
    //         } else {
    //             navigate('/login');
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error verifying token:', error);
    //         navigate('/login');
    //     });
    // }, [navigate]);
    
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    //para sa sort task
    const [sortBy, setSortBy] = useState('');
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const subjectRef = useRef(null);
    const instructorRef = useRef(null);
    const dateRef = useRef(null);

    //Para maka-add ug task
   const handleSaveTask = () => {
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const subject = subjectRef.current.value;
    const instructor = instructorRef.current.value;
    const date = dateRef.current.value;

    axios.post('http://localhost:3000/auth/addtask', {
        title,
        content,
        subject_code: subject,
        instructor_name: instructor,
        due_date: date,
        status: 'pending' 
    })
    .then(response => {
        console.log(response.data);
        handleClose();
        toast.success('Task added successfully!', { icon: '🟢' });
    })
    .catch(error => {
        console.error('Error adding task:', error);
        toast.error('Failed to add task!', { icon: '❌' });
    });
};

//for logout ni
const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
        .then(res => {
            if (res.data.success) {
                navigate('/login');
            } else {
                console.error('Logout failed:', res.data.message);
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
};


    //para sa sidebar, para inug tulpok sa icon kay mo-respond ang sidebar like for example mo collapsed or mo dili
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    //para makita ang recent time ug date
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            setCurrentDate(now.toLocaleDateString(undefined, {
                month: 'long', 
                day: '2-digit', 
                year: 'numeric'
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    //para sa task ni
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/auth/tasks')
            .then(res => {
                if (res.data.success && Array.isArray(res.data.tasks)) {
                    setTasks(res.data.tasks);
                } else {
                    console.error('Received data is not in the expected format:', res.data);
                }
            })
            .catch(err => console.log(err));
    }, []);
    

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(filter.toLowerCase())
    );

    //mark task completed button
    const markTaskCompleted = (taskId) => {
        axios.put(`http://localhost:3000/auth/tasks/${taskId}`, { status: 'Completed' })
            .then(response => {
                console.log(response.data);
                setTasks(prevTasks => prevTasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, status: 'Completed' };
                    }
                    return task;
                }));
                toast.success('Task marked as completed successfully!');
            })
            .catch(error => {
                console.error('Error marking task as completed:', error);
                toast.error('Failed to mark task as completed!');
            });
    };
//sa archive button pod ni
    const handleArchiveClick = (taskId) => {
        axios.put(`http://localhost:3000/auth/tasks/${taskId}/archive`)
            .then(response => {
                console.log(response.data);
                toast.success('Task archived successfully!');
            })
            .catch(error => {
                console.error('Error archiving task:', error);
                toast.error('Failed to archive task. Please try again.');
            });
    };
    
    //reminder notification ni
    const formatDueDate = (dueDate) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateObj = new Date(dueDate);
        const dayOfWeek = days[dateObj.getDay()];
        const month = months[dateObj.getMonth()];
        const dayOfMonth = dateObj.getDate();
        const year = dateObj.getFullYear();
        return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
    };

    //sa sort ni
    const handleSort = (sortBy) => {
        let sortedTasks = [...filteredTasks];
        switch (sortBy) {
            case 'alphabetical':
                sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date':
                sortedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
                break;
            default:
                break;
        }
        setTasks(sortedTasks);
    };

    //reminder
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);

    useEffect(() => {
        fetchTasks();
        getCurrentDate();
    }, []);

    useEffect(() => {
        if (upcomingCount > 0) {
            toast.info(`Reminder: You have ${upcomingCount} upcoming task${upcomingCount > 1 ? 's' : ''}!`, { autoClose: false });
        }
        if (missedCount > 0) {
            toast.warning(`You have missed ${missedCount} task${missedCount > 1 ? 's' : ''} !`, { autoClose: false });
        }
        if (upcomingCount === 0 && missedCount === 0) {
            toast.info("Time to relax, you have no task for today. Enjoy your free time!", { autoClose: false });
        }
    }, [upcomingCount, missedCount]);
    

    
    const fetchTasks = () => {
        axios.get('http://localhost:3000/auth/tasks')
            .then(res => {
                if (res.data.success && Array.isArray(res.data.tasks)) {
                    setTasks(res.data.tasks);
                    countUpcomingAndMissedTasks(res.data.tasks);
                } else {
                    console.error('Received data is not in the expected format:', res.data);
                }
            })
            .catch(err => console.log(err));
    };

    const countUpcomingAndMissedTasks = (tasks) => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        let upcomingCount = 0;
        let missedCount = 0;

        tasks.forEach(task => {
            const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);

            if (dueDate > currentDate) {
                upcomingCount++;
            } else if (dueDate === currentDate && task.status === 'pending') {
                missedCount++;
            }
        });

        setUpcomingCount(upcomingCount);
        setMissedCount(missedCount);
    };

    const getCurrentDate = () => {
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    };

    //para ma-display ang username
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
                            <h5>Welcome, <strong>{userData.username}</strong> !</h5>
                        </div>
                        <br />

                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/dashboard" data-bs-toggle="collapse" className="nav-link px-0 align-middle  custom-active-link">
                                    <i className="fs-5 bi-list-task"></i><span className="ms-1 d-sm-inline">All Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/completed" className="nav-link px-0 align-middle text-white">
                                <i class="fs-5 bi bi-clipboard-check"></i> <span className="ms-1 d-sm-inline">Completed Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/archive" className="nav-link px-0 align-middle text-white">
                                <i class="fs-5 bi bi-clipboard-heart"></i><span className="ms-1 d-sm-inline">Archive Task</span> </Link>
                            </li>
                           
                            <hr />
                            <br/>
                            <br/>
                            <br/>
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
                        <h4 className="text-center align-items-center">Student Task Scheduler</h4>
                        <Button onClick={handleShow}><i className="fs-5 bi-plus-circle"></i></Button>
                    </div>

                    <Outlet />
                    <div className='content p-4 shadow '>
                        <h1>{currentTime}</h1>
                        <p>{currentDate} <span className={`bi bi-bell-fill ${upcomingCount > 0 ? 'text-warning' : missedCount > 0 ? 'text-danger' : 'text-primary'}`}></span></p>
                    </div>
                    <h5 className='p-3'>All Tasks</h5>
                    <div className="p-4 shadow">
                    <div className="row mb-4 ">
                        <div className="col-lg-9">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search-heart"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search tasks..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                
                            </div>
                        </div>
                        <div className="col-lg-3 mt-2 mt-lg-0">
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-filter-left"></i></span>
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        handleSort(e.target.value);
                                    }}
                                >
                                    <option value="">Sort by...</option>
                                    <option value="alphabetical">Alphabetical Order</option>
                                    <option value="date">Due Date</option>
                                </select>
                            </div>
                        </div>

                    </div>

                        <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredTasks.map(task => (
                            <div className="col" key={task.id}>
                                <div className="card">
                                    <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                            <h4 className="card-title"><strong>{task.title}</strong></h4>
                                        </div>
                                        <p className="card-text"><strong>Description: </strong> {task.content}</p>
                                        <p className="card-text"><strong>Subject: </strong> {task.subject_code}</p>
                                        <p className="card-text"><strong>Instructor: </strong> {task.instructor_name}</p>
                                        <p className="card-text"><strong>Due date: </strong> {formatDueDate(task.due_date)}</p>
                                        <p className="card-text"><strong>Status: </strong> {task.status}</p>
                                       
                                        <div className="d-flex justify-content-center">
                                        <div className="text-center">
                                        <Button className='primary-button'
                                            variant="primary-button"
                                            onClick={() => markTaskCompleted(task.id)}
                                            disabled={task.status === 'Completed'}
                                        >
                                            Mark as Completed
                                        </Button>
                                        <div className="my-1"></div>
                                     <Button className='secondary-button'
                                        variant="secondary" 
                                        onClick={() => handleArchiveClick(task.id)}
                                        disabled={task.archive === 'Archived'}>
                                        <i className="bi-archive-fill"></i> Archive
                                        </Button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                        
                    </div>

                    </div>
            </div>
          
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Title" ref={titleRef} className='form-control rounded-5' />
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control type="text" placeholder="Content" ref={contentRef} className='form-control rounded-5' />
                        </Form.Group>
                        <Form.Group controlId="formSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="text" placeholder="Subject code" ref={subjectRef} className='form-control rounded-5' />
                        </Form.Group>
                        <Form.Group controlId="formInstructor">
                            <Form.Label>Instructor</Form.Label>
                            <Form.Control type="text" placeholder="Instructor name" ref={instructorRef} className='form-control rounded-5'/>
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Due date</Form.Label>
                            <Form.Control type="date" ref={dateRef} className='rounded-5' />
                        </Form.Group>
                       
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className="custom-btn-cancel">Cancel</Button>
                    <Button variant="primary" onClick={handleSaveTask} className="custom-btn-save">Save Task</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dashboard;
