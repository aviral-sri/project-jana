import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertPhotoSchema, insertSettingsSchema, insertTimelineEventSchema, insertUserSchema, User } from "@shared/schema";
import { z } from "zod";

// Extend the Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Passkey map for validation
const passkeyMap: Record<string, string> = {
  'love2023': 'couple',
  'jana2023': 'aviral',
  'aviral&shaili': 'shaili'
};

// Simple auth middleware
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, passkey } = req.body;
  
  if (!username || !passkey) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    // Check if passkey is valid
    const validUsername = passkeyMap[passkey];
    if (!validUsername || validUsername !== username) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Try to find user in database
    let user = await storage.getUserByUsername(username);
    
    // If user doesn't exist, create it
    if (!user) {
      user = await storage.createUser({
        username,
        password: passkey // Store passkey as password
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    const { username, passkey } = req.body;
    
    try {
      // Check if passkey is valid
      const validUsername = passkeyMap[passkey];
      if (!validUsername || validUsername !== username) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Try to find user in database
      let user = await storage.getUserByUsername(username);
      
      // If user doesn't exist, create it
      if (!user) {
        user = await storage.createUser({
          username,
          password: passkey // Store passkey as password
        });
      }
      
      res.status(200).json({ 
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Timeline event routes
  app.get('/api/timeline', async (req, res) => {
    try {
      const events = await storage.getAllTimelineEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching timeline events" });
    }
  });
  
  app.post('/api/timeline', async (req, res) => {
    try {
      const data = insertTimelineEventSchema.parse(req.body);
      const newEvent = await storage.createTimelineEvent(data);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating timeline event" });
    }
  });
  
  app.put('/api/timeline/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertTimelineEventSchema.parse(req.body);
      const updatedEvent = await storage.updateTimelineEvent(id, data);
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating timeline event" });
    }
  });
  
  app.delete('/api/timeline/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const success = await storage.deleteTimelineEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting timeline event" });
    }
  });
  
  // Photo gallery routes
  app.get('/api/photos', async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.status(200).json(photos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching photos" });
    }
  });
  
  app.post('/api/photos', async (req, res) => {
    try {
      const data = insertPhotoSchema.parse(req.body);
      const newPhoto = await storage.createPhoto(data);
      res.status(201).json(newPhoto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating photo" });
    }
  });
  
  app.put('/api/photos/:id/like', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedPhoto = await storage.togglePhotoLike(id);
      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.status(200).json(updatedPhoto);
    } catch (error) {
      res.status(500).json({ message: "Error updating photo like status" });
    }
  });
  
  app.delete('/api/photos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const success = await storage.deletePhoto(id);
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting photo" });
    }
  });
  
  // Notes routes
  app.get('/api/notes', async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notes" });
    }
  });
  
  app.post('/api/notes', async (req, res) => {
    try {
      const data = insertNoteSchema.parse(req.body);
      const newNote = await storage.createNote(data);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating note" });
    }
  });
  
  app.put('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = insertNoteSchema.parse(req.body);
      const updatedNote = await storage.updateNote(id, data);
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(updatedNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating note" });
    }
  });
  
  app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const success = await storage.deleteNote(id);
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting note" });
    }
  });
  
  // Settings routes
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings(1); // Assuming user id 1 for simplicity
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching settings" });
    }
  });
  
  app.put('/api/settings', async (req, res) => {
    try {
      const updatedSettings = await storage.updateSettings(1, req.body); // Assuming user id 1
      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Error updating settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
