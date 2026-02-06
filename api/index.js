import {
  __export
} from "./chunk-4VNS5WPM.js";

// server/index.ts
import express2 from "express";

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertJobSchema: () => insertJobSchema,
  insertPortfolioItemSchema: () => insertPortfolioItemSchema,
  insertSkillSchema: () => insertSkillSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertWorkExperienceSchema: () => insertWorkExperienceSchema,
  jobs: () => jobs,
  portfolioItems: () => portfolioItems,
  sessions: () => sessions,
  skills: () => skills,
  transactions: () => transactions,
  users: () => users,
  workExperience: () => workExperience
});
import { pgTable as pgTable3, text as text3, serial as serial2, doublePrecision as doublePrecision3, boolean as boolean2, timestamp as timestamp3, varchar as varchar3 } from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";

// shared/models/auth.ts
import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean, text, integer, doublePrecision } from "drizzle-orm/pg-core";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  omangStatus: varchar("omang_status").default("pending"),
  // pending, verified
  bio: text("bio"),
  yearsExperience: integer("years_experience").default(0),
  primarySkill: varchar("primary_skill"),
  trustScore: doublePrecision("trust_score").default(0),
  totalReviews: integer("total_reviews").default(0),
  responseTime: varchar("response_time"),
  balance: doublePrecision("balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// shared/models/transactions.ts
import { pgTable as pgTable2, text as text2, serial, doublePrecision as doublePrecision2, timestamp as timestamp2, varchar as varchar2 } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var transactions = pgTable2("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar2("user_id").notNull(),
  amount: doublePrecision2("amount").notNull(),
  type: text2("type").notNull(),
  // 'payment', 'topup'
  provider: text2("provider").notNull(),
  // 'orange_money'
  status: text2("status").notNull(),
  // 'pending', 'completed', 'failed'
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});

// shared/schema.ts
var jobs = pgTable3("jobs", {
  id: serial2("id").primaryKey(),
  title: text3("title").notNull(),
  company: text3("company").notNull(),
  description: text3("description").notNull(),
  category: text3("category").notNull(),
  lat: doublePrecision3("lat").notNull(),
  lng: doublePrecision3("lng").notNull(),
  salary: text3("salary"),
  type: text3("type").notNull(),
  // Full-time, Part-time, Contract
  contactPhone: text3("contact_phone").notNull(),
  landmark: text3("landmark"),
  isVerified: boolean2("is_verified").default(false).notNull(),
  createdAt: timestamp3("created_at").defaultNow().notNull()
});
var skills = pgTable3("skills", {
  id: serial2("id").primaryKey(),
  userId: varchar3("user_id").notNull(),
  name: text3("name").notNull()
});
var portfolioItems = pgTable3("portfolio_items", {
  id: serial2("id").primaryKey(),
  userId: varchar3("user_id").notNull(),
  title: text3("title").notNull(),
  description: text3("description"),
  imageUrl: text3("image_url").notNull(),
  createdAt: timestamp3("created_at").defaultNow().notNull()
});
var workExperience = pgTable3("work_experience", {
  id: serial2("id").primaryKey(),
  userId: varchar3("user_id").notNull(),
  company: text3("company").notNull(),
  position: text3("position").notNull(),
  description: text3("description").notNull(),
  startDate: text3("start_date").notNull(),
  endDate: text3("end_date")
  // null if current
});
var insertJobSchema = createInsertSchema2(jobs).omit({
  id: true,
  createdAt: true,
  isVerified: true
});
var insertSkillSchema = createInsertSchema2(skills).omit({ id: true });
var insertPortfolioItemSchema = createInsertSchema2(portfolioItems).omit({ id: true, createdAt: true });
var insertWorkExperienceSchema = createInsertSchema2(workExperience).omit({ id: true });

// server/db.ts
var { Pool } = pg;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getJobs() {
    return await db.select().from(jobs).orderBy(jobs.createdAt);
  }
  async getJob(id) {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }
  async createJob(insertJob) {
    const jobData = {
      ...insertJob,
      landmark: insertJob.landmark || null
    };
    const [job] = await db.insert(jobs).values(jobData).returning();
    return job;
  }
  async getSkills(userId) {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }
  async addSkill(userId, name) {
    const [skill] = await db.insert(skills).values({ userId, name }).returning();
    return skill;
  }
  async getPortfolio(userId) {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.userId, userId));
  }
  async getWorkExperience(userId) {
    return await db.select().from(workExperience).where(eq(workExperience.userId, userId));
  }
  async getTransactions(userId) {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(transactions.createdAt);
  }
  async createTransaction(tx) {
    const [transaction] = await db.insert(transactions).values(tx).returning();
    if (tx.status === "completed") {
      const [user] = await db.select().from(users).where(eq(users.id, tx.userId));
      if (user) {
        const newBalance = (user.balance || 0) + tx.amount;
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, tx.userId));
      }
    }
    return transaction;
  }
};
var storage = new DatabaseStorage();

// shared/routes.ts
import { z } from "zod";
var errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional()
  }),
  notFound: z.object({
    message: z.string()
  }),
  internal: z.object({
    message: z.string()
  })
};
var api = {
  jobs: {
    list: {
      method: "GET",
      path: "/api/jobs",
      responses: {
        200: z.array(z.custom())
      }
    },
    get: {
      method: "GET",
      path: "/api/jobs/:id",
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: "POST",
      path: "/api/jobs",
      input: insertJobSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation
      }
    }
  },
  profile: {
    get: {
      method: "GET",
      path: "/api/profile/:userId",
      responses: {
        200: z.object({
          user: z.custom(),
          skills: z.array(z.custom()),
          portfolio: z.array(z.custom()),
          workExperience: z.array(z.custom())
        }),
        404: errorSchemas.notFound
      }
    },
    addSkill: {
      method: "POST",
      path: "/api/profile/skills",
      input: z.object({ name: z.string() }),
      responses: {
        201: z.custom(),
        401: z.object({ message: z.string() })
      }
    }
  }
};

// server/routes.ts
import { z as z2 } from "zod";
import { eq as eq2 } from "drizzle-orm";
async function registerRoutes(httpServer2, app2) {
  app2.get(api.jobs.list.path, async (req, res) => {
    const jobs3 = await storage.getJobs();
    res.json(jobs3);
  });
  app2.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  });
  app2.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z2.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join(".")
        });
      }
      throw err;
    }
  });
  app2.get("/api/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    const authUser = await db.select().from(users).where(eq2(users.id, userId)).limit(1);
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
  app2.post("/api/transactions", async (req, res) => {
    const userId = "test-user-123";
    const tx = await storage.createTransaction({ ...req.body, userId });
    res.status(201).json(tx);
  });
  app2.post("/api/profile/skills", async (req, res) => {
    const userId = "test-user-123";
    const { name } = req.body;
    const skill = await storage.addSkill(userId, name);
    res.status(201).json(skill);
  });
  seedDatabase();
  return httpServer2;
}
async function seedDatabase() {
  const existingJobs = await storage.getJobs();
  if (existingJobs.length === 0) {
    await storage.createJob({
      title: "Barista",
      company: "Blue Bottle Coffee",
      category: "Food Service",
      description: "Looking for an experienced barista who loves coffee art.",
      lat: 37.7749,
      lng: -122.4194,
      salary: "$20/hr",
      type: "Part-time",
      contactPhone: "555-0101"
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
      contactPhone: "555-0102"
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
      contactPhone: "555-0103"
    });
    await storage.createJob({
      title: "Line Cook",
      company: "Joe's Diner",
      category: "Food Service",
      description: "Urgent! Need a line cook for weekend shifts.",
      lat: 37.7549,
      lng: -122.4394,
      salary: "$24/hr",
      type: "Part-time",
      contactPhone: "555-0104"
    });
  }
}

// server/static.ts
import express from "express";
import fs from "fs";
import path from "path";
function serveStatic(app2) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import { createServer } from "http";
var app = express2();
var httpServer = createServer(app);
app.use(
  express2.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express2.urlencoded({ extended: false }));
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await registerRoutes(httpServer, app);
  app.use((err, _req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(status).json({ message });
  });
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite-75HYGHYF.js");
    await setupVite(httpServer, app);
  }
  if (process.env.NODE_ENV !== "production") {
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  }
})();
var index_default = app;
export {
  index_default as default,
  log
};
