import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Calendaruser.css';

const Calendaruser = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState(""); 
  const calendarRef = useRef(null);

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleEventClick = (info) => {
    const event = info.event;
  
    const formatTime = (date) => (date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A');
  
    setSelectedEvent({
      title: event.title,
      where: event.extendedProps.where,
      start: formatTime(event.start), 
      end: formatTime(event.end),     
      attire: event.extendedProps.attire,
      description: event.extendedProps.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

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
      } 
    };
    fetchEvents(); 
  }, []);

  const updateMonthYear = (arg) => {
    const monthName = arg.view.currentStart.toLocaleString('default', { month: 'long' });
    const year = arg.view.currentStart.getFullYear();
    setCurrentMonthYear(`${monthName} ${year}`);
  };

  return (
    <div className='full-calendar-containeruser'>
      <div className='calendar-controls'>
        <button onClick={() => calendarRef.current.getApi().prev()} className="back-buttonuser" id='prevbutton'></button>
        <span id='calendar-titleusermonth'>{currentMonthYear}</span>
        <button onClick={() => calendarRef.current.getApi().next()} className="next-buttonuser" id='nextbutton'></button>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={false}
        eventClick={handleEventClick}
        headerToolbar={false}
        dayHeaderContent={(args) => args.date.toLocaleDateString('en-US', { weekday: 'long' })}
        datesSet={updateMonthYear} 
      />

      {showModal && selectedEvent && (
        <div className="modaluser">
          <div className="modal-content">
            <button className='userbutton' onClick={closeModal}>&times;</button>
            <h2 className='titlengevent'>{selectedEvent.title}</h2>
            <div className='usermodal'>
              <p><strong className='lamanngmodal'>Where:</strong> {selectedEvent.where}</p>
              <p><strong className='lamanngmodal'>Start:</strong> {selectedEvent.start}</p>
              <p><strong className='lamanngmodal'>End:</strong> {selectedEvent.end}</p>
              <p><strong className='lamanngmodal'>Attire:</strong> {selectedEvent.attire}</p>
              <p><strong className='lamanngmodal'>Description:</strong> {selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendaruser;
