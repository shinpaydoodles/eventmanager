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
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [saveConfirmModal, setSaveConfirmModal] = useState(false); 
  const [validationModal, setValidationModal] = useState(false);
  const [invalidValueModal, setInvalidValueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const calendarRef = useRef();

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(`/api/events/${selectedEvent._id}`);
        setEvents((prevEvents) => prevEvents.filter(event => event._id !== selectedEvent._id));
        setShowModal(false);
        setDeleteModal(false);
        setSelectedEvent(null);
  
        // Show success modal
        setDeleteSuccessModal(true);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };
  

  const handleEventResize = async (resizeInfo) => {
    const { event } = resizeInfo;
    const updatedEvent = {
      start: event.start.toISOString(), // Get the updated start time in ISO format
      end: event.end ? event.end.toISOString() : null, // Get the updated end time, null if not available
    };
  
    try {
      // Update the event in the backend
      await axios.put(`/api/events/${event.id}`, updatedEvent);
  
      // Update the events in the state to reflect the resized event
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt._id === event.id ? { ...evt, ...updatedEvent } : evt
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  const handleEventDrop = async (info) => {
    const { event } = info;
    const updatedEvent = {
      start: event.start.toISOString(),
      end: event.end ? event.end.toISOString() : null,
    };
  
    try {
      setLoading(true); // Set loading state to true
      // Update event in backend
      await axios.put(`/api/events/${event.id}`, updatedEvent);
  
      // Update local state with the new event data
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt._id === event.id ? { ...evt, ...updatedEvent } : evt
        )
      );
    } catch (error) {
      console.error("Error updating event after drag and drop:", error);
    } finally {
      setLoading(false); // Reset loading state
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
  
    // Validate required fields
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      setValidationMessage("Please fill in all the required fields.");
      setValidationModal(true);
      return;
    }
  
    // Validate title (alphanumeric and spaces only)
    const titlePattern = /^[A-Za-z0-9\s]+$/;
    if (!titlePattern.test(newEvent.title)) {
      setValidationMessage("Title can only contain letters, numbers, and spaces.");
      setValidationModal(true);
      return;
    }
  
    // Validate attire (alphanumeric and spaces only)
    const attirePattern = /^[A-Za-z0-9\s]+$/;
    if (newEvent.attire && !attirePattern.test(newEvent.attire)) {
      setValidationMessage("Attire can only contain letters, numbers, and spaces.");
      setValidationModal(true);
      return;
    }
  
    // Validate start and end times
    const startTime = new Date(`${selectedDate}T${newEvent.start}`);
    const endTime = new Date(`${selectedDate}T${newEvent.end}`);
    if (startTime >= endTime) {
      setValidationMessage("Start time must be before end time.");
      setValidationModal(true);
      return;
    } else if (!newEvent.start || !newEvent.end) {
      setValidationMessage("Time must be declared.");
      setInvalidValueModal(true);
      return;
    }
  
    const startDateTime = startTime.toISOString();
    const endDateTime = endTime.toISOString();
  
    const eventToSave = {
      ...newEvent,
      start: startDateTime,
      end: endDateTime,
      color: selectedType === 'holiday' ? 'goldenrod' : '#800000',
    };
  
    try {
      if (selectedEvent) {
        // Edit existing event
        const response = await axios.put(`/api/events/${selectedEvent._id}`, eventToSave);
        setEvents((prevEvents) =>
          prevEvents.map((evt) => (evt._id === selectedEvent._id ? { ...evt, ...eventToSave } : evt))
        );
      } else {
        // Add new event
        const response = await axios.post('/api/events', eventToSave);
        setEvents((prev) => [...prev, response.data]);
      }
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

  useEffect(() => {
    if (showModal || deleteModal || saveConfirmModal || validationModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal, deleteModal, saveConfirmModal, validationModal]);

  return (
    <div className='full-calendar-containeradmin'>
      <div className='calendar-controls'>
        <button onClick={goToPrev} className="back-buttonadmin" id='backbuttonadmin'></button>
        <span id='calendar-title'>{new Date().toLocaleString('default', { month: 'long' })} 
          {new Date().getFullYear()}</span>
        <button onClick={goToNext} className="next-buttonadmin" id='nextbuttonadmin'></button>
      </div>
      <FullCalendar
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
        droppable={true} 
        eventDrop={handleEventDrop}
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
          <button type="button" onClick={() => setShowModal(false)} className='cancel'>&times;</button>
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
                  
                />
              </label>
              <label>
                Start: <br />
                <input
                  type="time"
                  className="starttimemodal"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  
                />
              </label>
              <label>
                End: <br />
                <input
                  type="time"
                  className="endtimemodal"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  
                />
              </label>
              <label>
                Attire: <br></br>
                <input
                  type="text"
                  className='attiremodal'
                  value={newEvent.attire}
                  onChange={(e) => setNewEvent({ ...newEvent, attire: e.target.value })}
                  
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
        <div className="modaldel">
          <div className="modal-content">
            <h2 className='headngconfirmmodal'>Are you sure you want to delete this event?</h2>
            <button onClick={handleDeleteEvent} className='confirm-delete'>Yes</button>
            <button onClick={() => setDeleteModal(false)} className='cancel-delete'>No</button>
          </div>
        </div>
      )}
       {invalidValueModal && (
      <div className="modalinvalid">
        <div className="modal-content">
          <h2 className='headngconfirmmodal'>{validationMessage}</h2>
          <button onClick={() => setInvalidValueModal(false)} className='close-invalid'>&times;</button>
        </div>
      </div>
       )}
      {deleteSuccessModal && (
  <div className="modaldelete">
    <div className="modal-content">
      <h2 className='headngconfirmmodal'>Event deleted successfully!</h2>
      <button onClick={() => setDeleteSuccessModal(false)} className='close-delete'>&times;</button>
    </div>
  </div>
)}


      {saveConfirmModal && (
        <div className="modalsave">
          <div className="modal-content">
            <h2 className='headngconfirmmodal'>Event saved successfully!</h2>
            <button onClick={() => setSaveConfirmModal(false)} className='close-save'>&times;</button>
          </div>
        </div>
      )}

      {validationModal && (
        <div className="modalvalidation">
          <div className="modal-content">
            <h2 className='headngconfirmmodal'>{validationMessage}</h2>
            <button onClick={() => setValidationModal(false)} className='close-validation'>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAdmin;
