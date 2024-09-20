// Load the Google API Client Library
function loadGoogleApiClient() {
  return new Promise((resolve) => {
    gapi.load('client:auth2', resolve);
  });
}

// Initialize the Google API Client
export async function initializeGoogleAuth() {
  await loadGoogleApiClient();
  await gapi.client.init({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar.events'
  });
}

// Sign in the user
export async function signIn() {
  try {
    const googleAuth = gapi.auth2.getAuthInstance();
    await googleAuth.signIn();
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    return false;
  }
}

// Check if the user is signed in
export function isSignedIn() {
  const googleAuth = gapi.auth2.getAuthInstance();
  return googleAuth.isSignedIn.get();
}

// Create a Google Calendar event
export async function createGoogleCalendarEvent(summary, date) {
  if (!isSignedIn()) {
    throw new Error('User is not signed in');
  }

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
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return response.result;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}
