import { google } from 'googleapis';

let auth = null;

export const initializeGoogleAuth = (token) => {
  auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
};

export const createGoogleCalendarEvent = async (summary, date) => {
  if (!auth) {
    throw new Error('Google Auth not initialized');
  }

  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: summary,
    start: {
      date: date.toISOString().split('T')[0],
    },
    end: {
      date: date.toISOString().split('T')[0],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};