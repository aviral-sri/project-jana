// User types
export interface User {
  username: string;
  email?: string | null;
  uid?: string;
}

// Timeline event types
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  imageUrl?: string;
  createdAt?: any; // Timestamp
}

// Photo types
export interface Photo {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  liked: boolean;
  createdAt?: any; // Timestamp
}

// Note types
export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt?: any; // Timestamp
}

// Settings types
export interface Settings {
  anniversaryDate: string;
  birthdayDate?: string;
  anniversaryMessage?: string;
  birthdayMessage?: string;
}

// Countdown types
export interface CountdownUnit {
  label: string;
  value: string;
}

export interface CountdownData {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isAnniversary: boolean;
  yearsPassed: number;
}

// Form types
export interface PasskeyForm {
  passkey: string;
}

export interface TimelineEventForm {
  title: string;
  date: string;
  description: string;
  location?: string;
  imageFile?: File | null;
}

export interface PhotoForm {
  title: string;
  date: string;
  imageFile: File | null;
}

export interface NoteForm {
  content: string;
  author: string;
}

export interface SettingsForm {
  anniversaryDate: string;
  birthdayDate?: string;
  anniversaryMessage?: string;
  birthdayMessage?: string;
}
