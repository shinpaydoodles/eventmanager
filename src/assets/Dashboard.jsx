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
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats'); 
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data); 
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchStats(); 
  }, []); 

  return (
    <div className="container-dashboard">
      <h1 className="title">Dashboard</h1>
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
            <div className="elementss">
              <h2>Total Events</h2>
              <p>{stats.totalEvents}</p>
            </div>
            <div className="elementss">
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
