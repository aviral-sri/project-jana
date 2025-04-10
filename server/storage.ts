import { 
  users, type User, type InsertUser,
  timelineEvents, type TimelineEvent, type InsertTimelineEvent,
  photos, type Photo, type InsertPhoto,
  notes, type Note, type InsertNote,
  settings, type Settings, type InsertSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Timeline methods
  getAllTimelineEvents(): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: number, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: number): Promise<boolean>;

  // Photo methods
  getAllPhotos(): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  togglePhotoLike(id: number): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;

  // Note methods
  getAllNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;

  // Settings methods
  getSettings(userId: number): Promise<Settings | undefined>;
  updateSettings(userId: number, data: Partial<InsertSettings>): Promise<Settings | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Timeline methods
  async getAllTimelineEvents(): Promise<TimelineEvent[]> {
    return db.select().from(timelineEvents).orderBy(asc(timelineEvents.date));
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const [newEvent] = await db
      .insert(timelineEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async updateTimelineEvent(id: number, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined> {
    const [updatedEvent] = await db
      .update(timelineEvents)
      .set(event)
      .where(eq(timelineEvents.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    const result = await db
      .delete(timelineEvents)
      .where(eq(timelineEvents.id, id));
    return !!result.rowCount;
  }

  // Photo methods
  async getAllPhotos(): Promise<Photo[]> {
    return db.select().from(photos).orderBy(desc(photos.date));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db
      .insert(photos)
      .values(photo)
      .returning();
    return newPhoto;
  }

  async togglePhotoLike(id: number): Promise<Photo | undefined> {
    // First get the current like status
    const [photo] = await db
      .select()
      .from(photos)
      .where(eq(photos.id, id));

    if (!photo) return undefined;

    // Toggle the like status
    const [updatedPhoto] = await db
      .update(photos)
      .set({ liked: !photo.liked })
      .where(eq(photos.id, id))
      .returning();
    
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const result = await db
      .delete(photos)
      .where(eq(photos.id, id));
    return !!result.rowCount;
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db
      .insert(notes)
      .values(note)
      .returning();
    return newNote;
  }

  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set(note)
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(eq(notes.id, id));
    return !!result.rowCount;
  }

  // Settings methods
  async getSettings(userId: number): Promise<Settings | undefined> {
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId));
    
    // Return existing settings or create default ones
    if (setting) return setting;

    // Create default settings
    const defaultSettings: InsertSettings = {
      anniversaryDate: "2021-08-15",
      birthdayDate: "",
      anniversaryMessage: "Today marks another beautiful year of our journey together. Every moment with you has been a blessing. Here's to many more years of love, laughter, and creating precious memories.",
      birthdayMessage: "",
      userId
    };

    const [newSettings] = await db
      .insert(settings)
      .values(defaultSettings)
      .returning();
    
    return newSettings;
  }

  async updateSettings(userId: number, data: Partial<InsertSettings>): Promise<Settings | undefined> {
    // Check if settings exist
    const [existingSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId));

    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(settings)
        .set(data)
        .where(eq(settings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings with the data
      const fullData = {
        ...data,
        anniversaryDate: data.anniversaryDate || "2021-08-15",
        userId
      } as InsertSettings;

      const [newSettings] = await db
        .insert(settings)
        .values(fullData)
        .returning();
      return newSettings;
    }
  }
}

export const storage = new DatabaseStorage();
