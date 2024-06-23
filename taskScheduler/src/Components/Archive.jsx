import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoSchedule from '/Images/logo-schedule.png';


function Archive() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [archiveTasks, setArchiveTasks] = useState([]); 
    const [restoredTasks, setRestoredTasks] = useState([]);
    const [trashedTasks, setTrashedTasks] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleRestore = (taskId) => {
        axios.put(`http://localhost:3000/auth/tasks/${taskId}/restore`)
            .then(res => {
                if (res.data.success) {
                  
                    toast.success('Task restored successfully');
                    // Fetch updated list of restored tasks
                    fetchRestoredTasks();
                } else {
                   
                    toast.error('Failed to restore task');
                }
            })
            .catch(err => {
                console.error("Error restoring task:", err);
                toast.error('Failed to restore task');
            });
    };

    const fetchRestoredTasks = () => {
        axios.get('http://localhost:3000/auth/restoredTasks')
            .then(res => {
                if (res.data.success && Array.isArray(res.data.tasks)) {
                    setRestoredTasks(res.data.tasks); 
                } else {
                    console.error('Received data is not in the expected format:', res.data);
                }
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        fetchRestoredTasks(); 
    }, []); 
    

    const handleDelete = (taskId) => {
        const confirmDelete = window.confirm('Do you want to delete this task permanently?');
    
        if (confirmDelete) {
            axios.delete(`http://localhost:3000/auth/trash/${taskId}`) 
                .then(res => {
                    if (res.data.success) {
                        toast.success('Task deleted successfully');
                    } else {
                        toast.error('Failed to delete task');
                    }
                })
                .catch(err => {
                    console.error("Error deleting task:", err);
                    toast.error('Failed to delete task');
                });
        }
    };
    
    
    
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
       
        axios.get('http://localhost:3000/auth/archiveTasks')
            .then(res => {
                if (res.data.success && Array.isArray(res.data.tasks)) {
                    setArchiveTasks(res.data.tasks);
                    setLoading(false);
                } else {
                    console.error('Received data is not in the expected format:', res.data);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleMoveToTrash = (taskId) => {
        axios.put(`http://localhost:3000/auth/tasks/${taskId}/move-to-trash`)
            .then(res => {
                if (res.data.success) {
                    toast.success('Task moved to trash successfully');
                    setTrashedTasks(prevState => [...prevState, taskId]); // Add taskId to trashedTasks state
                    setArchiveTasks(prevState => prevState.filter(task => task.id !== taskId));
                } else {
                    toast.error('Failed to move task to trash');
                }
            })
            .catch(err => {
                console.error('Error moving task to trash:', err);
                toast.error('Failed to move task to trash');
            });
    };

    useEffect(() => {
        
        axios.get('http://localhost:3000/auth/trashedTasks')
            .then(res => {
                if (res.data.success && Array.isArray(res.data.tasks)) {
                    setTrashedTasks(res.data.tasks);
                } else {
                    console.error('Received data is not in the expected format:', res.data);
                }
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
                                <Link to="/dashboard" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-list-task"></i><span className="ms-1 d-sm-inline">All Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/completed" className="nav-link px-0 align-middle text-white">
                                <i class="fs-5 bi bi-clipboard-check"></i>  <span className="ms-1  d-sm-inline">Completed Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/archive" className="nav-link px-0 align-middle custom-active-link">
                                <i class="fs-5 bi bi-clipboard-heart"> </i><span className="ms-1  d-sm-inline">Archive </span> </Link>
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
                    <div className='d-flex justify-content-start'>
                        <button className="btn  d-md-none" onClick={handleToggleSidebar}>
                            <i className="fs-5 bi bi-list"></i>
                        </button>
                    </div>
                    <div className=' d-flex justify-content-end'>      
                        <Button onClick={handleShow}><i class="bi-trash"></i></Button>
                    </div>

                    <div className="p-4">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {archiveTasks.length === 0 ? (   
                        <div className='text-center '>
                            <i class="fs-1 bi bi-exclamation-circle"></i>
                            <p>No archive tasks</p>
                    </div>
                    
                        ) : (
                            <div className="archive-tasks">
                                <h3>Archive Tasks</h3>
                                {archiveTasks.map(task => (
                                    <div className="card mb-3" key={task.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">{task.title}</h5>
                                            <p>{task.content}</p>
                                        </div>
                                        <div className="card-footer">
                                            <button className="btn rounded-5" onClick={() => handleMoveToTrash(task.id)}>
                                                Move to Trash <i className="bi bi-arrow-up-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                    <br />
                    <hr />
                    
                    {restoredTasks.length === 0 ? (
                        <div className='text-center'>
                            <i class="fs-1 bi bi-emoji-frown"></i>
                            <p>No restored tasks</p>
                        </div>
                    ) : (
                        <div className="restored-tasks">
                            <h3>Restored Tasks</h3>
                            <div className="task-cards">
                                {restoredTasks.map(task => (
                                    <div className="card" key={task.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">{task.title}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </>
            )}
        </div>
                   
                </div>
            </div>
            <Modal show={showModal} onHide={handleClose}>
    <Modal.Header closeButton>
        <Modal.Title>Trash</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {trashedTasks.map(task => (
            <div key={task.id} className="row">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <h5>{task.title}</h5>
                            <p>{task.content}</p>
                            
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col mb-1">
                            <Button variant="bg-info w-50 rounded-5" onClick={() => handleRestore(task.id)} style={{ color: 'white'}}>Restore</Button>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col">
                        <Button variant='btn w-50 rounded-5' onClick={() => handleDelete(task.id)} style={{backgroundColor: '#CD5C5C', color: 'white'}}>Delete</Button>


                        </div>
                    </div>
                </div>
                <hr/ >
            </div>
        ))}
    </Modal.Body>
</Modal>


        </div>
    );
}

export default Archive;
