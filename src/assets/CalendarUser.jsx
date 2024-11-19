import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Calendaruser.css';

const Calendaruser = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    where: '',
    start: '',
    end: '',
    attire: '',
    description: '',
    color: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  axios.defaults.baseURL = "http://localhost:5000";

  

  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent({
      title: event.title,
      where: event.extendedProps.where,
      start: event.start ? event.start.toLocaleString() : 'N/A',
      end: event.end ? event.end.toLocaleString() : 'N/A',
      attire: event.extendedProps.attire,
      description: event.extendedProps.description,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventToAdd = {
      title: newEvent.title,
      description: newEvent.description,
      where: newEvent.where,
      attire: newEvent.attire,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };

    try {
      const response = await axios.post('/api/events', eventToAdd);
      setEvents([...events, response.data]);
      setShowModal(false);
      setNewEvent({ title: '', start: '', end: '', attire: '', description: '' });
    } catch (error) {
      console.error('Error saving event:', error);
    }
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
      } finally {
        setLoading(false); 
      }
    };
    fetchEvents(); 
  }, []); 

  return (
    <div className='full-calendar-containeruser'>
      <div className='calendar-controls'>
        <button onClick={() => calendarRef.current.getApi().prev()} className="back-buttonuser" id='prevbutton'></button>
        <span id='calendar-title'>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</span>
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
      />

      {showModal && selectedEvent && (
        <div className="modaluser">
          <div className="modal-content">
            <button className='userbutton' onClick={closeModal}>X</button>
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
