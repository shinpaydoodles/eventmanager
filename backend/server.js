import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import fetchHolidays from './googleCalendar.js';

dotenv.config(); 

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://ciceventmanager.netlify.app', 'http://localhost:5000', 'http://localhost:5173'],
}));

app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));


const eventSchema = new mongoose.Schema({
  title: String,
  where: String,
  start: Date,
  end: Date,
  attire: String,
  description: String,
  color: String,
});

const Event = mongoose.model('Event', eventSchema);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


const sendEmail = (event, timeFrame) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'hanyzelcenon@gmail.com', 
    subject: `Reminder: ${event.title || 'Your Event'} is starting soon!`,
    text: `The event "${event.title || 'Your Event'}" is happening in ${timeFrame}.\n\nDetails:\n${event.description || 'No description provided'}\nLocation: ${event.where || 'No location provided'}\nStart: ${event.start ? new Date(event.start).toLocaleString() : 'No start time provided'}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

const scheduleEmails = async () => {
  try {
    const events = await Event.find(); 
    const now = new Date();

    events.forEach(event => {
      const timeDiff = (new Date(event.start) - now) / (1000 * 60 * 60); 

      if (timeDiff > 167 && timeDiff < 168) { 
        sendEmail(event, '7 days');
      } else if (timeDiff > 71 && timeDiff < 72) { 
        sendEmail(event, '3 days');
      } else if (timeDiff > 23 && timeDiff < 24) { 
        sendEmail(event, '24 hours');
      } else if (timeDiff > 0 && timeDiff < 1) { 
        sendEmail(event, '1 hour');
      }
    });
  } catch (err) {
    console.error('Error scheduling emails:', err);
  }
};


cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled email task');
  await scheduleEmails();
});


app.get('/api/schedule-emails', async (req, res) => {
  try {
    await scheduleEmails();
    res.json({ message: 'Emails scheduled successfully' });
  } catch (err) {
    console.error('Error scheduling emails:', err);
    res.status(500).json({ error: 'Failed to schedule emails' });
  }
});

// CRUD 

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


app.post('/api/events', async (req, res) => {
  const { title, where, start, end, attire, description, color } = req.body;
  const newEvent = new Event({ title, where, start, end, attire, description, color });

  try {
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(500).json({ error: 'Failed to save event' });
  }
});


app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, where, start, end, attire, description, color } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, where, start, end, attire, description, color },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});


app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await users.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
// google calendar route

app.get('/api/holidays', async (req, res) => {
  try {
    const holidays = await fetchHolidays(); // Call the Google Calendar API
    res.json(holidays); // Return holidays as JSON response
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
