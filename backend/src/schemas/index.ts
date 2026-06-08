import { pgTable, text, numeric, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const soilReports = pgTable('soil_reports', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sampleName: text('sample_name').notNull(),
  sieveNo200: numeric('sieve_no_200', { precision: 5, scale: 2 }).notNull(),
  sieveNo4: numeric('sieve_no_4', { precision: 5, scale: 2 }).notNull(),
  liquidLimit: numeric('liquid_limit', { precision: 5, scale: 2 }).notNull(),
  plasticLimit: numeric('plastic_limit', { precision: 5, scale: 2 }).notNull(),
  plasticityIndex: numeric('plasticity_index', { precision: 5, scale: 2 }).notNull(),
  soilClassification: text('soil_classification').notNull(),
  treatmentRecommendation: text('treatment_recommendation').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SoilReport = typeof soilReports.$inferSelect;
export type NewSoilReport = typeof soilReports.$inferInsert;
