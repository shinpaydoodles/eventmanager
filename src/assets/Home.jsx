import React, { useState, useEffect } from "react";
import "./Home.css"; 

const Home = () => {
  const [events, setEvents] = useState([]); 
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


  
  const backgroundColor = events.length > 0 ? events[0].color : "#fff"; 

  return (
    <>
    <h1 className="hometitle">School Event Manager</h1>
    <div className="events-container" >
              <div className="events-list">
              <h2 className="event-title">Events List</h2>
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event._id} className="event-item">
                  <p>Title: {event.title}</p>
                  <p>Where: {event.where}</p>
                  <p>Start: {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>End: {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Attire: {event.attire}</p>
                  <p>Description: {event.description}</p>
                  </div>
                ))
              ) : (
                <p>No events found.</p>
              )}
            </div>
            </div>
            </>
  );  
};

export default Home;
