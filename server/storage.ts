import { db } from "./db.js";
import { jobs, skills, portfolioItems, workExperience, transactions, users, type CreateJobRequest, type Job, type Skill, type PortfolioItem, type WorkExperience, type Transaction } from "@shared/schema";
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
  
  // Fintech methods
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: any): Promise<Transaction>;
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
    const jobData = {
      ...insertJob,
      landmark: insertJob.landmark || null
    };
    const [job] = await db.insert(jobs).values(jobData).returning();
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

  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(transactions.createdAt);
  }

  async createTransaction(tx: any): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(tx).returning();
    // Update user balance if completed
    if (tx.status === 'completed') {
      const [user] = await db.select().from(users).where(eq(users.id, tx.userId));
      if (user) {
        const newBalance = (user.balance || 0) + tx.amount;
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, tx.userId));
      }
    }
    return transaction;
  }
}

export const storage = new DatabaseStorage();
