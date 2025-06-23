import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserActivitySchema, insertUserPillarSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Health pillars routes
  app.get("/api/pillars", async (req, res) => {
    try {
      const pillars = await storage.getHealthPillars();
      res.json(pillars);
    } catch (error) {
      console.error("Get pillars error:", error);
      res.status(500).json({ message: "Failed to fetch pillars" });
    }
  });

  app.get("/api/users/:id/pillars", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userPillars = await storage.getUserPillars(userId);
      res.json(userPillars);
    } catch (error) {
      console.error("Get user pillars error:", error);
      res.status(500).json({ message: "Failed to fetch user pillars" });
    }
  });

  app.post("/api/users/:id/pillars", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const pillarData = insertUserPillarSchema.parse({ ...req.body, userId });
      
      const userPillar = await storage.upsertUserPillar(pillarData);
      res.json(userPillar);
    } catch (error) {
      console.error("Upsert user pillar error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const { context } = req.query;
      
      let activities;
      if (context) {
        activities = await storage.getActivitiesByContext(context as string);
      } else {
        activities = await storage.getActivities();
      }
      
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/users/:id/activities/:date", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const date = req.params.date;
      
      const userActivities = await storage.getUserActivitiesForDate(userId, date);
      res.json(userActivities);
    } catch (error) {
      console.error("Get user activities error:", error);
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  app.post("/api/users/:id/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const activityData = insertUserActivitySchema.parse({ ...req.body, userId });
      
      const userActivity = await storage.createUserActivity(activityData);
      
      // Update user points and potentially streak
      const user = await storage.getUser(userId);
      if (user) {
        const newPoints = user.healthPoints + activityData.pointsEarned;
        await storage.updateUser(userId, { healthPoints: newPoints });
      }
      
      res.json(userActivity);
    } catch (error) {
      console.error("Create user activity error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Get user achievements error:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Rewards routes
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Get rewards error:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.get("/api/users/:id/rewards", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userRewards = await storage.getUserRewards(userId);
      res.json(userRewards);
    } catch (error) {
      console.error("Get user rewards error:", error);
      res.status(500).json({ message: "Failed to fetch user rewards" });
    }
  });

  // Referrals routes
  app.post("/api/users/:id/referrals", async (req, res) => {
    try {
      const referrerId = parseInt(req.params.id);
      const { email } = req.body;
      
      const referral = await storage.createReferral(referrerId, email);
      res.json(referral);
    } catch (error) {
      console.error("Create referral error:", error);
      res.status(500).json({ message: "Failed to create referral" });
    }
  });

  app.get("/api/referrals/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const referral = await storage.getReferralByCode(code);
      
      if (!referral) {
        return res.status(404).json({ message: "Referral not found" });
      }
      
      res.json(referral);
    } catch (error) {
      console.error("Get referral error:", error);
      res.status(500).json({ message: "Failed to fetch referral" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
