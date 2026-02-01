import { db } from "./db";
import { jobs, skills, portfolioItems, workExperience, type CreateJobRequest, type Job, type Skill, type PortfolioItem, type WorkExperience } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: CreateJobRequest): Promise<Job>;
  
  // Profile methods
  getSkills(userId: string): Promise<Skill[]>;
  addSkill(userId: string, name: string): Promise<Skill>;
  getPortfolio(userId: string): Promise<PortfolioItem[]>;
  getWorkExperience(userId: string): Promise<WorkExperience[]>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(insertJob: CreateJobRequest): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getSkills(userId: string): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }

  async addSkill(userId: string, name: string): Promise<Skill> {
    const [skill] = await db.insert(skills).values({ userId, name }).returning();
    return skill;
  }

  async getPortfolio(userId: string): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.userId, userId));
  }

  async getWorkExperience(userId: string): Promise<WorkExperience[]> {
    return await db.select().from(workExperience).where(eq(workExperience.userId, userId));
  }
}

export const storage = new DatabaseStorage();
