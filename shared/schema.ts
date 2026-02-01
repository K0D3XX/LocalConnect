import { pgTable, text, serial, doublePrecision, boolean, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Import users/sessions from auth model to ensure they are created
export * from "./models/auth";
import { users } from "./models/auth";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  salary: text("salary"),
  type: text("type").notNull(), // Full-time, Part-time, Contract
  contactPhone: text("contact_phone").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New Table: Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
});

// Update User model in shared/schema.ts (implicitly via auth model but let's ensure fields exist)
// Note: We use the existing users table from auth model. 
// Let's add verification fields if they don't exist in the actual DB or schema.
// Since shared/schema.ts exports * from "./models/auth", we should check that file.

// New Table: Portfolio Items
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New Table: Work Experience
export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"), // null if current
});

export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  createdAt: true,
  isVerified: true 
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({ id: true, createdAt: true });
export const insertWorkExperienceSchema = createInsertSchema(workExperience).omit({ id: true });

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Skill = typeof skills.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type WorkExperience = typeof workExperience.$inferSelect;

export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;
