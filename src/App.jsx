import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import AdminApp from './admin/Adminapp.jsx';
import UserApp from './user/Userapp.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
      
      {isAuthenticated && isAdmin ? (
        <Route path="/admin/*" element={<AdminApp />} />
      ) : (
        <Route path="/admin/*" element={<Navigate to="/"  />} />
      )}

      {isAuthenticated && !isAdmin ? (
        <Route path="/user/*" element={<UserApp />} />
      ) : (
        <Route path="/user/*" element={<Navigate to="/"  />} />
      )}
    </Routes>
  );
};

export default App;
