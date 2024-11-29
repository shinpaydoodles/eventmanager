import { google } from 'googleapis';

const calendar = google.calendar('v3');
const auth = new google.auth.GoogleAuth({
  keyFile: './keys/eventmanager-443115-6f8043369eb4.json', 
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const fetchHolidays = async () => {
  try {
    const authClient = await auth.getClient();
    const calendarId = 'en.philippines#holiday@group.v.calendar.google.com';
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
      color: 'goldenrod', // Set the color to goldenrod for holidays
    }));
  } catch (err) {
    console.error('Error fetching holidays:', err);
    return [];
  }
};

export default fetchHolidays;
