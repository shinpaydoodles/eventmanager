import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SidebarUser from '../assets/SidebarUser.jsx';
import Home from '../assets/Home.jsx';
import WeekView from '../assets/Week.jsx';
import Calendaruser from '../assets/CalendarUser.jsx';
import './Userapp.css';

const UserApp = () => {
  return (
    <div className="header">
      <SidebarUser />
      <div className="app-container">
        <main className="content">
          
          <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/calendaruser" element={<Calendaruser />} />
            <Route path="/week" element={<WeekView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserApp;
