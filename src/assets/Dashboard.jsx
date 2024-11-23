import React, { useState, useEffect } from 'react';
import SidebarAdmin from './SidebarAdmin';
import './Dashboard.css'; 

// Define users and admins at the top of the file
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

  const currentUser = admins[1]; // Set the current logged-in user (example)

  const countUsers = () => {
    const totalUsers = users.length + admins.length; // Total users including admins
    const registeredUsers = users.length; // Registered users are the non-admin users
    return { totalUsers, registeredUsers };
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://eventmanager-omt8.onrender.com/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      console.log(data);  // Log data to ensure it contains events and holidays

      // Counting events based on color
      const totalEvents = data.filter(event => event.color === '#800000').length;
      const totalHolidays = data.filter(event => event.color === 'goldenrod').length;

      // Update stats with user and event data
      const { totalUsers, registeredUsers } = countUsers(); // Get user count
      setStats({
        totalUsers: totalUsers,  // Updated total users
        registeredUsers: registeredUsers,  // Updated registered users
        totalEvents: totalEvents,
        totalHolidays: totalHolidays
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);  // Ensure loading state is set to false after the fetch
    }
  };

  useEffect(() => {
    fetchEvents();  // Fetch events on component mount
  }, []);

  return (
    <div className="container-dashboard">

      <h1 className="titledashboard">Dashboard</h1>
      <div className="dashboard-container">
        {loading ? (
          <p>Loading statistics...</p>
        ) : (
          <>
            <div className="elementss">
              <h2>Total Users</h2>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="elementss">
              <h2>Registered Users</h2>
              <p>{stats.registeredUsers}</p>
            </div>
            <br />
            <div className="elementss" id="totalevents">
              <h2>Total Events</h2>
              <p>{stats.totalEvents}</p>
            </div>
            <div className="elementss" id="totalholiday">
              <h2>Total Holidays</h2>
              <p>{stats.totalHolidays}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;