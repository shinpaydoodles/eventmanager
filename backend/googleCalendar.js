// calendar.js
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const calendar = google.calendar('v3');

const fetchHolidays = async () => {
  try {
    const authClient = await auth.getClient();
    const calendarId = 'en.philippines#holiday@group.v.calendar.google.com'; // Philippines Holidays
    const response = await calendar.events.list({
      auth: authClient,
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items.map(event => ({
      title: event.summary,
      start: event.start.date || event.start.dateTime,
      end: event.end.date || event.end.dateTime,
      description: event.description || '',
      where: event.location || '',
      color: 'goldenrod',
    }));
  } catch (err) {
    console.error('Error fetching holidays:', err);
    return [];
  }
};

export default fetchHolidays;
