// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Login from './Components/Login';
// import Dashboard from './Components/Dashboard';
// import Register from './Components/Register';
// import Completed from './Components/Completed';
// import Archive from './Components/Archive';

// function App() {
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const isAuthenticated = localStorage.getItem('token');
//     if (isAuthenticated) {
//       setAuthenticated(true);
//     }
//   }, []);

//   return (
//     <BrowserRouter>
//       <ToastContainer /> 
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/completed" element={authenticated ? <Completed /> : <Navigate to="/login" />} />
//         <Route path="/archive" element={authenticated ? <Archive /> : <Navigate to="/login" />} />
//         <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;







import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard'; 
import Register from './Components/Register';
import Completed from './Components/Completed';
import Archive from './Components/Archive';


function App() {
  return (
    <BrowserRouter>
      <ToastContainer /> 
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/completed' element={<Completed />} />
        <Route path='/archive' element={<Archive />} />
    

      </Routes>
    </BrowserRouter>
  );
}

export default App;
