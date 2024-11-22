import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    totalEvents: 0,
    totalHolidays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://eventmanager-omt8.onrender.com/api/events"); 
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data); 
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents(); 
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
            </div><br></br>
            <div className="elementss" id='totalevents'>
              <h2>Total Events</h2>
              <p>{stats.totalEvents}</p>
            </div>
            <div className="elementss" id='totalholiday'>
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
