import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SidebarAdmin from '../assets/SidebarAdmin.jsx';
import CalendarAdmin from '../assets/CalendarAdmin.jsx';
import Home from '../assets/Home.jsx';
import Dashboard from '../assets/Dashboard.jsx';
import './Adminapp.css';

const AdminApp = () => {
  return (
    <div className="header">
      <SidebarAdmin />
      <div className="app-container">
        <main className="content">
          <Routes>
            <Route path="/home" element={<Home />} /> 
            <Route path="/admin/calendaradmin" element={<CalendarAdmin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
