import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://ciceventmanager.netlify.app', 'http://localhost:5000'],
}));

app.use(express.json()); // Middleware to parse JSON bodies

console.log('MongoDB URI:', process.env.MONGO_URI); // For debugging (remove in production)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define the event schema and model
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

// Basic root route for testing
app.get('/', (req, res) => {
  res.send('Event Manager API is running');
});

// Route to create a new event
app.post('/api/events', async (req, res) => {
  const { title, where, start, end, attire, description, color } = req.body;
  console.log('Received event data:', req.body); // For debugging

  const newEvent = new Event({ title, where, start, end, attire, description, color });
  try {
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error('Error saving event:', err); // For debugging
    res.status(500).json({ error: 'Failed to save event: ' + err.message });
  }
});

// Route to get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err); // For debugging
    res.status(500).json({ error: 'Failed to fetch events: ' + err.message });
  }
});

// Route to update an event
app.put('/api/events/:id', async (req, res) => {
  console.log('Received update request for event ID:', req.params.id); // For debugging
  const { title, where, start, end, attire, description, color } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, where, start, end, attire, description, color },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err); // For debugging
    res.status(500).json({ error: 'Failed to update event: ' + err.message });
  }
});

// Route to delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err); // For debugging
    res.status(500).json({ error: 'Failed to delete event: ' + err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
