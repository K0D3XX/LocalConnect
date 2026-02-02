import { pgTable, text, serial, doublePrecision, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  type: text("type").notNull(), // 'payment', 'topup'
  provider: text("provider").notNull(), // 'orange_money'
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true 
});

export type Transaction = typeof transactions.$inferSelect;
