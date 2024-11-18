import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './calendaradmin.css';

const CalendarAdmin = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [saveConfirmModal, setSaveConfirmModal] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const calendarRef = useRef();

  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/${adminId}/events`);
      console.log(response.data); // Check the response format
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error('Events data is not an array', response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(`/api/events/${selectedEvent._id}`);
        setEvents((prevEvents) => prevEvents.filter(event => event._id !== selectedEvent._id));
        setShowModal(false);
        setDeleteModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };
  const handleEventResize = async (resizeInfo) => {
    const { event } = resizeInfo;
    console.log("Resizing event:", event);
    try {
      const updatedEvent = {
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : null, // If no end date, set to null
      };
  
      await axios.put(`/api/events/${event.id}`, updatedEvent);
      
      setEvents((prevEvents) =>
        prevEvents.map((evt) => (evt._id === event.id ? { ...evt, ...updatedEvent } : evt))
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };


  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setNewEvent({ title: '', where: '', start: '', end: '', attire: '', description: '', color: '' });
    setShowModal(true);
    setSelectedEvent(null); 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(`${selectedDate}T${newEvent.start}`).toISOString();
    const endDateTime = new Date(`${selectedDate}T${newEvent.end}`).toISOString();

    const eventToAdd = {
      ...newEvent,
      start: startDateTime,
      end: endDateTime,
      color: selectedType === 'holiday' ? 'goldenrod' : '#800000', 
    };

    try {
      const response = await axios.post('/api/events', eventToAdd);
      setEvents((prev) => [...prev, response.data]);
      setShowModal(false); 
      setNewEvent({ title: '', where: '', start: '', end: '', attire: '', description: '', color: '' }); 
      setSaveConfirmModal(true);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  

  const handleEventClick = (info) => {
    const clickedEvent = events.find(event => event._id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setNewEvent(clickedEvent);
      setShowModal(true);
    }
  };

  const handleEventButtonClick = () => {
    setSelectedType('event');
    setNewEvent((prev) => ({
      ...prev,
      color: '#800000', 
    }));
    setShowModal(true);
  };
  
  const handleHolidayButtonClick = () => {
    setSelectedType('holiday');
    setNewEvent((prev) => ({
      ...prev,
      color: 'goldenrod', 
    }));
    setShowModal(true);
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

  return (
    <div className='full-calendar-containeradmin'>
      <div className='calendar-controls'>
        <button onClick={goToPrev} className="back-buttonadmin" id='backbuttonadmin'></button>
        <span id='calendar-title'>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</span>
        <button onClick={goToNext} className="next-buttonadmin" id='nextbuttonadmin'></button>
      </div>
      <FullCalendar
      className="fulladmincalendar"
        ref={calendarRef} 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(event => ({
          ...event,
          color: event.color || '#800000',
          id: event._id,
        }))}
        editable={true}
        eventResizableFromStart={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={false}
        dayHeaderContent={(args) => {
          return args.date.toLocaleDateString('en-US', { weekday: 'long' });
        }}
        eventDidMount={(info) => {
          const { event } = info;
          info.el.style.backgroundColor = event.extendedProps.color; 
        }}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
          <button type="button" onClick={() => setShowModal(false)} className='cancel'>X</button>
            <h2 className='headngmodal'>{selectedEvent ? "Edit Event" : "Add New Event"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title: <br></br>
                <input
                  type="text"
                  className='titlemodal'
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </label>
              <label>
                Where: <br></br>
                <input
                  type="text"
                  className='wheremodal'
                  value={newEvent.where}
                  onChange={(e) => setNewEvent({ ...newEvent, where: e.target.value })}
                  required
                />
              </label>
              <label>
                Start: <br />
                <input
                  type="time"
                  className="starttimemodal"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  required
                />
              </label>
              <label>
                End: <br />
                <input
                  type="time"
                  className="endtimemodal"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  required
                />
              </label>
              <label>
                Attire: <br></br>
                <input
                  type="text"
                  className='attiremodal'
                  value={newEvent.attire}
                  onChange={(e) => setNewEvent({ ...newEvent, attire: e.target.value })}
                  required
                />
              </label>
              <label>
                Description: <br></br>
                <textarea
                  className='descripmodal'
                  style={{ width: '308px', height: '148px' }}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  
                />
              </label>
              <button onClick={handleEventButtonClick} className={`eventsbutton ${selectedType === 'event' ? 'selected' : ''}`}>Save as event</button>
              <button onClick={handleHolidayButtonClick} className={`holidaybutton ${selectedType === 'holiday' ? 'selected' : ''}`}>Save as Holiday</button>

              {selectedEvent && (
                <button type="button" onClick={() => setDeleteModal(true)} className='deleteevent'>Delete Event</button>
              )}
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className='headngconfirmmodal'>Are you sure you want to delete this event?</h2>
            <button onClick={handleDeleteEvent} className='confirm-delete'>Yes</button>
            <button onClick={() => setDeleteModal(false)} className='cancel-delete'>No</button>
          </div>
        </div>
      )}

      {saveConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className='headngconfirmmodal'>Event saved successfully!</h2>
            <button onClick={() => setSaveConfirmModal(false)} className='close-confirm'>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAdmin;