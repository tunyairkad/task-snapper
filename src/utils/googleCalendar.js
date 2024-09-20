// Load the Google API Client Library
function loadGoogleApiClient() {
  return new Promise((resolve, reject) => {
    if (typeof gapi !== 'undefined') {
      gapi.load('client:auth2', resolve);
    } else {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:auth2', resolve);
      };
      script.onerror = (error) => reject(new Error(`Failed to load Google API script: ${error.message}`));
      document.body.appendChild(script);
    }
  });
}

// Initialize the Google API Client
export async function initializeGoogleAuth() {
  try {
    await loadGoogleApiClient();
    await gapi.client.init({
      apiKey: 'AIzaSyBZWW3qtYXGP9RejZrqFYvU3VZP2mtARWg',
      clientId: '220858364378-d5a5ea06a731vd5f9484ru7hprdr6sdl.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    });
    console.log('Google Auth initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw new Error(`Failed to initialize Google Auth: ${error.message}`);
  }
}

// Sign in the user
export async function signIn() {
  try {
    const googleAuth = gapi.auth2.getAuthInstance();
    const user = await googleAuth.signIn({
      prompt: 'select_account'
    });
    if (user) {
      console.log('User signed in successfully');
      return true;
    }
    console.log('Sign-in cancelled by user');
    return false;
  } catch (error) {
    console.error('Error signing in:', error);
    if (error.error === "popup_closed_by_user") {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.error === "access_denied") {
      throw new Error('Access was denied. Please check your Google account permissions.');
    } else {
      throw new Error(`An error occurred during sign-in: ${error.message}`);
    }
  }
}

// Check if the user is signed in
export function isSignedIn() {
  try {
    const googleAuth = gapi.auth2.getAuthInstance();
    return googleAuth && googleAuth.isSignedIn.get();
  } catch (error) {
    console.error('Error checking sign-in status:', error);
    return false;
  }
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
    console.log('Event created successfully:', response.result);
    return response.result;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw new Error(`Failed to create Google Calendar event: ${error.message}`);
  }
}
