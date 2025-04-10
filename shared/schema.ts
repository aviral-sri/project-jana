import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Timeline events table
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull(),
});

// Photos table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
  liked: boolean("liked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull(),
});

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull(),
});

// Settings table for dates and countdowns
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  anniversaryDate: text("anniversary_date").notNull(),
  birthdayDate: text("birthday_date"),
  anniversaryMessage: text("anniversary_message"),
  birthdayMessage: text("birthday_message"),
  userId: integer("user_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
