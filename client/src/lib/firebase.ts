import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, Timestamp, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase configuration
// In a production app, these would come from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-jana"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-jana",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-jana"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "12345",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:abcde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Simple passkey authentication
export const authenticateWithPasskey = async (username: string, passkey: string) => {
  try {
    // Try to authenticate with backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        passkey 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const userData = await response.json();
    return { user: userData };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Timeline functions
export const getTimelineEvents = async () => {
  try {
    const response = await fetch('/api/timeline');
    
    if (!response.ok) {
      throw new Error('Failed to fetch timeline events');
    }
    
    const events = await response.json();
    return events;
  } catch (error) {
    console.error("Error getting timeline events:", error);
    throw error;
  }
};

export const addTimelineEvent = async (eventData: any) => {
  try {
    let response;
    
    // Check if eventData is FormData (for file uploads)
    if (eventData instanceof FormData) {
      response = await fetch('/api/timeline', {
        method: 'POST',
        body: eventData, // No Content-Type header for FormData (browser sets it with boundary)
      });
    } else {
      response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to add timeline event');
    }
    
    const newEvent = await response.json();
    return newEvent;
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

export const updateTimelineEvent = async (id: string, eventData: any) => {
  try {
    let response;
    
    // Check if eventData is FormData (for file uploads)
    if (eventData instanceof FormData) {
      response = await fetch(`/api/timeline/${id}`, {
        method: 'PUT',
        body: eventData, // No Content-Type header for FormData (browser sets it with boundary)
      });
    } else {
      response = await fetch(`/api/timeline/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to update timeline event');
    }
    
    const updatedEvent = await response.json();
    return updatedEvent;
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

export const deleteTimelineEvent = async (id: string) => {
  try {
    const response = await fetch(`/api/timeline/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete timeline event');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};

// Photo functions
export const getPhotos = async () => {
  try {
    const response = await fetch('/api/photos');
    
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    
    const photos = await response.json();
    return photos;
  } catch (error) {
    console.error("Error getting photos:", error);
    throw error;
  }
};

export const addPhoto = async (photoData: any, file: File) => {
  try {
    // Create FormData and append the file and other data
    const formData = new FormData();
    
    // Append photo data as JSON string
    formData.append('data', JSON.stringify(photoData));
    
    // Append the file
    formData.append('image', file);
    
    // Send the request
    const response = await fetch('/api/photos', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to add photo');
    }
    
    const newPhoto = await response.json();
    return newPhoto;
  } catch (error) {
    console.error("Error adding photo:", error);
    throw error;
  }
};

export const togglePhotoLike = async (id: string, currentStatus: boolean) => {
  try {
    const response = await fetch(`/api/photos/${id}/like`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle photo like status');
    }
    
    const updatedPhoto = await response.json();
    return updatedPhoto;
  } catch (error) {
    console.error("Error toggling photo like:", error);
    throw error;
  }
};

export const deletePhoto = async (id: string, imageUrl: string) => {
  try {
    const response = await fetch(`/api/photos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};

// Notes functions
export const getNotes = async () => {
  try {
    const response = await fetch('/api/notes');
    
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    
    const notes = await response.json();
    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

export const addNote = async (noteData: any) => {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add note');
    }
    
    const newNote = await response.json();
    return newNote;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const updateNote = async (id: string, noteData: any) => {
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    
    const updatedNote = await response.json();
    return updatedNote;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// Settings functions
export const getSettings = async () => {
  try {
    const response = await fetch('/api/settings');
    
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    const settings = await response.json();
    return settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

export const updateSettings = async (settingsData: any) => {
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    
    const updatedSettings = await response.json();
    return updatedSettings;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export { auth, db, storage };
