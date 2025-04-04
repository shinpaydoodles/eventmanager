import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 


const users = [
  { 
    email: 'luisbenico', 
    password: '12345', 
    isAdmin: false, 
    userName: 'Luis Benico', 
    userEmail: 'luisbenico@gmail.com' 
  },
  {
    email: 'royarimbuyutan', 
    password: '12345',
    isAdmin: false,
    userName: 'Roy V. Arimbuyutan',
    userEmail: 'royvarimbuyutan@cic.edu.ph'
  }
];

const admins = [
  { 
    email: 'hanyzelcenon', 
    password: 'qwerty', 
    isAdmin: true, 
    userName: 'Hanyzel V. Cenon', 
    userEmail: '22410122@cic.edu.ph' 
  },
  { 
    email: 'luisbenico', 
    password: 'qwerty', 
    isAdmin: true, 
    userName: 'Luis Miguel Benico', 
    userEmail: '22410185@cic.edu.ph' 
  },
  { 
    email: 'nicoperalta', 
    password: 'qwerty', 
    isAdmin: true, 
    userName: 'Nicholas James Peralta', 
    userEmail: '22410112@cic.edu.ph' 
  },
  {
    email: 'johnaldrin',
    password: 'qwerty',
    isAdmin: true,
    userName: 'John Aldrin Santos',
    userEmail: '22410111@cic.edu.ph'
  }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    totalEvents: 0,
    totalHolidays: 0,
  });
  const [loading, setLoading] = useState(true);

  const currentUser = admins[1]; 

  const countUsers = () => {
    const totalUsers = users.length + admins.length; 
    const registeredUsers = users.length; 
    return { totalUsers, registeredUsers };
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://eventmanager-omt8.onrender.com/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      console.log(data);  

      
      const totalEvents = data.filter(event => event.color === '#800000').length;
      const totalHolidays = data.filter(event => event.color === 'goldenrod').length;

      
      const { totalUsers, registeredUsers } = countUsers(); 
      setStats({
        totalUsers: totalUsers,  
        registeredUsers: registeredUsers,  
        totalEvents: totalEvents,
        totalHolidays: totalHolidays
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchEvents();  
  }, []);

  return (
    <div className="container-dashboard">
      <h1 className="titledashboard">Dashboard</h1>
      <div className="dashboard-container">
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="dashboard-row">
              <div className="elementss element-small" id='totalusers'>
                <h2>Total Users</h2>
                <p className='number'>{stats.totalUsers}</p>
              </div>
              <div className="elementss element-small">
                <h2>Registered Users</h2>
                <p className='number' id='reguser'>{stats.registeredUsers}</p>
              </div>
            </div>
            <div className="dashboard-row">
              <div className="elementss element-large" id="totalevents">
                <h2>Total Events</h2>
                <p className='number1'>{stats.totalEvents}</p>
              </div>
            </div>
            <div className="dashboard-row">
              <div className="elementss element-large" id="holidays">
                <h2>Total Holidays</h2>
                <p className='number2'>{stats.totalHolidays}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;