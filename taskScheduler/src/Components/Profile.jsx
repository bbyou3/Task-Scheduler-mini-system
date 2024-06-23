import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoSchedule from '/Images/logo-schedule.png';

function Profile() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        address: '',
        school: '',
        program: '',
        year: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then(res => {
                navigate('/start');
            })
            .catch(err => console.log(err));
    };

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Assuming the profile photo is uploaded before submitting the form
        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('address', profileData.address);
        formData.append('school', profileData.school);
        formData.append('program', profileData.program);
        formData.append('year', profileData.year);
        formData.append('photo', profilePhoto);

        axios.post('http://localhost:3000/auth/profiles', formData)
            .then(response => {
                console.log(response.data.message);
                setShowModal(false);
            })
            .catch(error => {
                console.error("Error adding profile:", error);
            });
    };

    const handleUploadPhoto = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProfileData({
            name: '',
            address: '',
            school: '',
            program: '',
            year: ''
        });
        setProfilePhoto(null);
    };
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <Link to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                            <img src={logoSchedule} alt="Logo" width="150" height="150" className="me-2" />
                        </Link>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/dashboard" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-list-task"></i><span className="ms-1 d-none d-sm-inline">All Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/completed" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-card-checklist"></i>  <span className="ms-1 d-none d-sm-inline">Completed Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/archive" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-archive"></i><span className="ms-1 d-none d-sm-inline">Archive Task</span> </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="nav-link px-0 align-middle">
                                    <i className="fs-5 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Profile</span></Link>
                            </li>
                            <hr />
                            <li onClick={handleLogout}>
                                <a href="#" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-5 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span></a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="main col p-2 m-0">
                    <div className='p-2 d-flex justify-content-between shadow'>
                        <button className="btn  d-md-none" onClick={handleToggleSidebar}>
                            <i className="fs-5 bi bi-list"></i>
                        </button>
                        <h4 className="text-center align-items-center">My profile</h4>
                    </div>
                    <div className="profile-me p-4 mt-4">
                        <div className="profile-me-body">
                            <div className="d-flex align-items-start">
                                <div className="profile-photo-container me-5">
                                    <div className="profile-photo-wrapper-me">
                                        <img src="/path/to/profile-photo.png" alt="Profile" className="profile-photo" />
                                    </div>
                                    <div className="add-profile">
                                        <Button className="primary-btn">Edit Profile</Button>
                                        <p>*if new, click the button ⬇⬇⬇ <br/>
                                            <a className="btn-click" onClick={() => setShowModal(true)}>Add new profile</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="profile-me-box me-2">
                                        <div className="profile-info">
                                            <div className="form-group mb-3"><h3>Name</h3>
                                                <div>{profileData.name}</div>
                                            </div>
                                            <div className="form-group mb-3"><h3>Address</h3>
                                                <div>{profileData.address}</div>
                                            </div>
                                            <div className="form-group mb-3"><h3>School</h3>
                                                <div>{profileData.school}</div>
                                            </div>
                                            <div className="form-group mb-3"><h3>Program</h3>
                                                <div>{profileData.program}</div>
                                            </div>
                                            <div className="form-group mb-3"><h3>Year</h3>
                                                <div>{profileData.year}</div>
                                            </div>
                                        </div>
                                    </div>

                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="profile-section">
                            <div className="profile-card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="profile-photo-container me-3">
                                            <img src={profilePhoto ? URL.createObjectURL(profilePhoto) : "/path/to/default-profile-photo.png"} alt="Profile" className="profile-photo" />
                                            <br />
                                            <Button variant="primary" size="sm">
                                                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>Upload Photo</label>
                                                <input
                                                    id="fileInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleUploadPhoto}
                                                    style={{ display: 'none' }}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="profile-info-box">
                                            <div className="profile-info">
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="form-label">Name</label>
                                                    <input type="text" className="form-control" id="name" name="name" value={profileData.name} onChange={handleChange} autocomplete="name"  />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="address" className="form-label">Address</label>
                                                    <input type="text" className="form-control" id="address" name="address" value={profileData.address} onChange={handleChange} autocomplete="address" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="school" className="form-label">School</label>
                                                    <input type="text" className="form-control" id="school" name="school" value={profileData.school} onChange={handleChange} autocomplete="school" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="program" className="form-label">Program</label>
                                                    <input type="text" className="form-control" id="program" name="program" value={profileData.program} onChange={handleChange} autocomplete="program" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="year" className="form-label">Year</label>
                                                    <input type="text" className="form-control" id="year" name="year" value={profileData.year} onChange={handleChange} autocomplete="year" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Profile;
