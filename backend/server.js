import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: 'https://your-frontend-domain.com' }));
app.use(express.json());

console.log('MongoDB URI:', process.env.MONGO_URI); // Temporary log for verification

mongoose.connect(process.env.MONGO_URI)
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


app.post('/api/events', async (req, res) => {
  const { title, where, start, end, attire, description, color } = req.body;

  console.log('Received event data:', req.body);  

  
  const newEvent = new Event({ title, where, start, end, attire, description, color });
  try {
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error('Error saving event:', err);  
    res.status(500).json({ error: 'Failed to save event: ' + err.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);  
    res.status(500).json({ error: 'Failed to fetch events: ' + err.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
    console.log('Received resize update for event ID:', req.params.id)
  const { title, where, start, end, attire, description, color } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, where, start, end, attire, description, color },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err);  
    res.status(500).json({ error: 'Failed to update event: ' + err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);  
    res.status(500).json({ error: 'Failed to delete event: ' + err.message });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
