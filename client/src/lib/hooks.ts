import { useState, useEffect } from 'react';
import { 
  loginUser, 
  getTimelineEvents, 
  getPhotos, 
  getNotes, 
  getSettings,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  addPhoto,
  togglePhotoLike,
  deletePhoto,
  addNote,
  updateNote,
  deleteNote
} from './firebase';
import { User, TimelineEvent, Photo, Note, Settings, CountdownData } from './types';

// Authentication hooks
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (via localStorage for demo)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(username, password);
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result.user;
    } catch (e) {
      setError('Invalid username or password');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    loading,
    error,
    login,
    logout
  };
};

// Timeline hooks
export const useTimelineEvents = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getTimelineEvents();
      setEvents(data as TimelineEvent[]);
      setError(null);
    } catch (e) {
      setError('Error fetching timeline events');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData: any, file?: File) => {
    try {
      let newEvent;
      if (file) {
        // Handle file upload logic if needed
        newEvent = await addTimelineEvent({
          ...eventData,
          // Handle file upload logic here if needed
        });
      } else {
        newEvent = await addTimelineEvent(eventData);
      }
      setEvents(prev => [...prev, newEvent as TimelineEvent]);
      return newEvent;
    } catch (e) {
      console.error('Error adding event:', e);
      throw e;
    }
  };

  const updateEvent = async (id: string, eventData: any) => {
    try {
      const updatedEvent = await updateTimelineEvent(id, eventData);
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      ));
      return updatedEvent;
    } catch (e) {
      console.error('Error updating event:', e);
      throw e;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteTimelineEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (e) {
      console.error('Error deleting event:', e);
      throw e;
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
};

// Photo hooks
export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getPhotos();
      setPhotos(data as Photo[]);
      setError(null);
    } catch (e) {
      setError('Error fetching photos');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const addNewPhoto = async (photoData: any, file: File) => {
    try {
      const newPhoto = await addPhoto(photoData, file);
      setPhotos(prev => [newPhoto as Photo, ...prev]);
      return newPhoto;
    } catch (e) {
      console.error('Error adding photo:', e);
      throw e;
    }
  };

  const toggleLike = async (id: string, currentStatus: boolean) => {
    try {
      const result = await togglePhotoLike(id, currentStatus);
      setPhotos(prev => prev.map(photo => 
        photo.id === id ? { ...photo, liked: !currentStatus } : photo
      ));
      return result;
    } catch (e) {
      console.error('Error toggling like:', e);
      throw e;
    }
  };

  const removePhoto = async (id: string, imageUrl: string) => {
    try {
      await deletePhoto(id, imageUrl);
      setPhotos(prev => prev.filter(photo => photo.id !== id));
    } catch (e) {
      console.error('Error deleting photo:', e);
      throw e;
    }
  };

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    addPhoto: addNewPhoto,
    toggleLike,
    deletePhoto: removePhoto
  };
};

// Notes hooks
export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data as Note[]);
      setError(null);
    } catch (e) {
      setError('Error fetching notes');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNewNote = async (noteData: any) => {
    try {
      const newNote = await addNote(noteData);
      setNotes(prev => [newNote as Note, ...prev]);
      return newNote;
    } catch (e) {
      console.error('Error adding note:', e);
      throw e;
    }
  };

  const updateExistingNote = async (id: string, noteData: any) => {
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      ));
      return updatedNote;
    } catch (e) {
      console.error('Error updating note:', e);
      throw e;
    }
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (e) {
      console.error('Error deleting note:', e);
      throw e;
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote: addNewNote,
    updateNote: updateExistingNote,
    deleteNote: removeNote
  };
};

// Settings hooks
export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data as Settings);
      setError(null);
    } catch (e) {
      setError('Error fetching settings');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings
  };
};

// Countdown hook
export const useCountdown = (targetDate: string) => {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isAnniversary: false,
    yearsPassed: 0
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      
      // Set target to this year
      target.setFullYear(now.getFullYear());
      
      // If already passed this year, set to next year
      if (now > target) {
        target.setFullYear(now.getFullYear() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      
      // Check if today is the anniversary
      const isAnniversary = now.getDate() === target.getDate() && 
                           now.getMonth() === target.getMonth();
                           
      // Calculate years passed since original date
      const originalDate = new Date(targetDate);
      const yearsPassed = now.getFullYear() - originalDate.getFullYear();
      
      if (diff <= 0 && isAnniversary) {
        // It's anniversary day!
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isAnniversary,
          yearsPassed
        });
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isAnniversary,
        yearsPassed
      });
    };
    
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return countdown;
};

// Relationship duration hook
export const useRelationshipDuration = (startDate: string) => {
  const [duration, setDuration] = useState('');
  
  useEffect(() => {
    if (!startDate) return;
    
    const calculateDuration = () => {
      const start = new Date(startDate);
      const now = new Date();
      
      const years = now.getFullYear() - start.getFullYear();
      const months = now.getMonth() - start.getMonth();
      const days = now.getDate() - start.getDate();
      
      let adjustedYears = years;
      let adjustedMonths = months;
      let adjustedDays = days;
      
      if (days < 0) {
        // Borrow from months
        adjustedMonths -= 1;
        // Add days of the previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        adjustedDays = prevMonth.getDate() + days;
      }
      
      if (adjustedMonths < 0) {
        // Borrow from years
        adjustedYears -= 1;
        adjustedMonths += 12;
      }
      
      let result = '';
      if (adjustedYears > 0) {
        result += `${adjustedYears} ${adjustedYears === 1 ? 'year' : 'years'}`;
      }
      
      if (adjustedMonths > 0) {
        if (result) result += ', ';
        result += `${adjustedMonths} ${adjustedMonths === 1 ? 'month' : 'months'}`;
      }
      
      if (adjustedDays > 0 || result === '') {
        if (result) result += ', ';
        result += `${adjustedDays} ${adjustedDays === 1 ? 'day' : 'days'}`;
      }
      
      setDuration(result);
    };
    
    calculateDuration();
    // Update once a day
    const timer = setInterval(calculateDuration, 86400000);
    
    return () => clearInterval(timer);
  }, [startDate]);
  
  return duration;
};
