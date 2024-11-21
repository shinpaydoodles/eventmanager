import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Week.css';

const WeekView = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const calendarRef = useRef(null);

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (info) => {
    const clickedEvent = events.find(event => event._id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setShowModal(true); 
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const goToNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    updateCalendarTitle(calendarApi);
  };

  const goToPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    updateCalendarTitle(calendarApi);
  };

  const updateCalendarTitle = (calendarApi) => {
    const currentView = calendarApi.view;
    const title = currentView.title; 
    document.getElementById('calendar-title').innerText = title; 
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      updateCalendarTitle(calendarApi); 
    }
  }, []);

  return (
    <div className='full-calendar-containeruserweek'>
      <div className='calendar-controls'>
        <button onClick={goToPrev} className="back-buttonweek" id='prevbuttonweek'></button>
        <span id='calendar-title'>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</span>
        <button onClick={goToNext} className="next-buttonweek" id='nextbuttonweek'></button>
      </div>
      
      <FullCalendar
        className="week-calendar"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={events.map(event => ({
          ...event,
          id: event._id,
        }))}
        editable={false}
        eventClick={handleEventClick}
        headerToolbar={false}
        dayHeaderContent={(args) => {
          return args.date.toLocaleDateString('en-US', { weekday: 'long' });
        }}
      />

      {showModal && selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <button className='userbutton' onClick={closeModal}>X</button>
            <h2 className='titlengevent'>{selectedEvent.title}</h2>
            <div className='usermodal'>
              <p><strong>Where:</strong> {selectedEvent.where}</p>
              <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
              <p><strong>Attire:</strong> {selectedEvent.attire}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
