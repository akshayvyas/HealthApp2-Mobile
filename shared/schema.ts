import { pgTable, text, serial, integer, boolean, timestamp, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: text("age"),
  gender: text("gender"),
  goal: text("goal"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  newsletterOptIn: boolean("newsletter_opt_in").default(false),
  healthPoints: integer("health_points").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  level: integer("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthPillars = pgTable("health_pillars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const userPillars = pgTable("user_pillars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pillarId: integer("pillar_id").references(() => healthPillars.id).notNull(),
  score: integer("score").default(0), // 0-4 scale
  totalPoints: integer("total_points").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  points: integer("points").notNull(),
  pillarId: integer("pillar_id").references(() => healthPillars.id).notNull(),
  context: text("context").notNull(), // morning, commute, work-break, evening
  level: text("level").default("beginner"), // beginner, intermediate, advanced
  isActive: boolean("is_active").default(true),
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  pointsEarned: integer("points_earned").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  requirement: text("requirement"), // JSON string with achievement criteria
  points: integer("points").default(0),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pointCost: integer("point_cost").notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rewardId: integer("reward_id").references(() => rewards.id).notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
  status: text("status").default("pending"), // pending, fulfilled, cancelled
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  refereeEmail: text("referee_email"),
  refereeId: integer("referee_id").references(() => users.id),
  code: text("code").notNull().unique(),
  status: text("status").default("pending"), // pending, completed
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  age: true,
  gender: true,
  goal: true,
  newsletterOptIn: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  activityId: true,
  pointsEarned: true,
  date: true,
});

export const insertUserPillarSchema = createInsertSchema(userPillars).pick({
  userId: true,
  pillarId: true,
  score: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HealthPillar = typeof healthPillars.$inferSelect;
export type UserPillar = typeof userPillars.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type UserReward = typeof userRewards.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type InsertUserPillar = z.infer<typeof insertUserPillarSchema>;
