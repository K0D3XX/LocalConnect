import { db } from "./db";
import { jobs, type CreateJobRequest, type Job } from "@shared/schema";

export interface IStorage {
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: CreateJobRequest): Promise<Job>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(jobs.id.eq(id));
    return job;
  }

  async createJob(insertJob: CreateJobRequest): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }
}

export const storage = new DatabaseStorage();
