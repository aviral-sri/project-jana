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
export const authenticateWithPasskey = async (passkey: string) => {
  try {
    // Define the valid passkeys and associated usernames
    const passkeyMap: Record<string, string> = {
      'love2023': 'couple',
      'jana2023': 'aviral',
      'aviral&shaili': 'shaili'
    };
    
    if (passkey in passkeyMap) {
      const username = passkeyMap[passkey];
      
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
    }
    
    // If passkey is not valid, throw an error
    throw new Error("Invalid passkey");
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
    const response = await fetch('/api/timeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
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
    const response = await fetch(`/api/timeline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
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
    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `photos/${file.name}_${Date.now()}`);
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Add photo data to Firestore
    const photosCollection = collection(db, "photos");
    const docRef = await addDoc(photosCollection, {
      ...photoData,
      imageUrl: downloadURL,
      createdAt: Timestamp.now(),
      liked: false
    });
    
    return {
      id: docRef.id,
      ...photoData,
      imageUrl: downloadURL,
      liked: false
    };
  } catch (error) {
    console.error("Error adding photo:", error);
    throw error;
  }
};

export const togglePhotoLike = async (id: string, currentStatus: boolean) => {
  try {
    const photoRef = doc(db, "photos", id);
    await updateDoc(photoRef, {
      liked: !currentStatus
    });
    
    return {
      id,
      liked: !currentStatus
    };
  } catch (error) {
    console.error("Error toggling photo like:", error);
    throw error;
  }
};

export const deletePhoto = async (id: string, imageUrl: string) => {
  try {
    // Delete from Firestore
    const photoRef = doc(db, "photos", id);
    await deleteDoc(photoRef);
    
    // Delete from Storage
    if (imageUrl) {
      try {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.error("Error deleting photo from storage:", storageError);
        // Continue with deletion even if storage delete fails
      }
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
    const notesCollection = collection(db, "notes");
    const q = query(notesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

export const addNote = async (noteData: any) => {
  try {
    const notesCollection = collection(db, "notes");
    const docRef = await addDoc(notesCollection, {
      ...noteData,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...noteData,
      createdAt: Timestamp.now()
    };
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const updateNote = async (id: string, noteData: any) => {
  try {
    const noteRef = doc(db, "notes", id);
    await updateDoc(noteRef, noteData);
    
    return {
      id,
      ...noteData
    };
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// Settings functions
export const getSettings = async () => {
  try {
    const settingsDoc = doc(db, "settings", "app-settings");
    const snapshot = await getDoc(settingsDoc);
    
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      // Create default settings if they don't exist
      const defaultSettings = {
        anniversaryDate: "2021-08-15",
        birthdayDate: "",
        anniversaryMessage: "Today marks another beautiful year of our journey together. Every moment with you has been a blessing. Here's to many more years of love, laughter, and creating precious memories.",
        birthdayMessage: ""
      };
      
      await setDoc(settingsDoc, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

export const updateSettings = async (settingsData: any) => {
  try {
    const settingsRef = doc(db, "settings", "app-settings");
    await setDoc(settingsRef, settingsData, { merge: true });
    
    return settingsData;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export { auth, db, storage };
