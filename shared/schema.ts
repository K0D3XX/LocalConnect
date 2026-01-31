import { pgTable, text, serial, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Import users/sessions from auth model to ensure they are created
export * from "./models/auth";

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

export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  createdAt: true,
  isVerified: true // Only admin/system verifies
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;
