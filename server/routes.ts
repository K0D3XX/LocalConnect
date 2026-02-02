import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.jobs.list.path, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    // Optional: Check auth here if posting requires login
    // if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Profile Routes
  app.get("/api/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    const authUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (authUser.length === 0) return res.status(404).json({ message: "User not found" });

    const [profileSkills, portfolio, experience] = await Promise.all([
      storage.getSkills(userId),
      storage.getPortfolio(userId),
      storage.getWorkExperience(userId)
    ]);

    res.json({
      user: authUser[0],
      skills: profileSkills,
      portfolio,
      workExperience: experience,
      transactions: await storage.getTransactions(userId)
    });
  });

  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).claims.sub;
    const tx = await storage.createTransaction({ ...req.body, userId });
    res.status(201).json(tx);
  });

  app.post("/api/profile/skills", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).claims.sub;
    const { name } = req.body;
    const skill = await storage.addSkill(userId, name);
    res.status(201).json(skill);
  });

  // Seed Data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingJobs = await storage.getJobs();
  if (existingJobs.length === 0) {
    // San Francisco Area
    await storage.createJob({
      title: "Barista",
      company: "Blue Bottle Coffee",
      category: "Food Service",
      description: "Looking for an experienced barista who loves coffee art.",
      lat: 37.7749,
      lng: -122.4194,
      salary: "$20/hr",
      type: "Part-time",
      contactPhone: "555-0101",
    });
    
    await storage.createJob({
      title: "Warehouse Associate",
      company: "Logistics Pro",
      category: "Labor",
      description: "Entry level warehouse position. Heavy lifting required.",
      lat: 37.7849,
      lng: -122.4094,
      salary: "$22/hr",
      type: "Full-time",
      contactPhone: "555-0102",
    });

    await storage.createJob({
      title: "Receptionist",
      company: "Downtown Dental",
      category: "Office",
      description: "Friendly front desk receptionist needed for busy dental practice.",
      lat: 37.7649,
      lng: -122.4294,
      salary: "$25/hr",
      type: "Full-time",
      contactPhone: "555-0103",
    });
    
    // New job (Hiring Now)
    await storage.createJob({
      title: "Line Cook",
      company: "Joe's Diner",
      category: "Food Service",
      description: "Urgent! Need a line cook for weekend shifts.",
      lat: 37.7549,
      lng: -122.4394,
      salary: "$24/hr",
      type: "Part-time",
      contactPhone: "555-0104",
    });
  }
}
