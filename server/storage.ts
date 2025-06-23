import { users, healthPillars, userPillars, activities, userActivities, achievements, userAchievements, rewards, userRewards, referrals, type User, type InsertUser, type HealthPillar, type UserPillar, type Activity, type UserActivity, type Achievement, type UserAchievement, type Reward, type UserReward, type Referral, type InsertUserActivity, type InsertUserPillar } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Health pillars
  getHealthPillars(): Promise<HealthPillar[]>;
  getUserPillars(userId: number): Promise<UserPillar[]>;
  upsertUserPillar(data: InsertUserPillar): Promise<UserPillar>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  getActivitiesByContext(context: string): Promise<Activity[]>;
  getUserActivitiesForDate(userId: number, date: string): Promise<UserActivity[]>;
  createUserActivity(data: InsertUserActivity): Promise<UserActivity>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  
  // Rewards
  getRewards(): Promise<Reward[]>;
  getUserRewards(userId: number): Promise<UserReward[]>;
  
  // Referrals
  createReferral(referrerId: number, email: string): Promise<Referral>;
  getReferralByCode(code: string): Promise<Referral | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private healthPillars: Map<number, HealthPillar> = new Map();
  private userPillars: Map<number, UserPillar> = new Map();
  private activities: Map<number, Activity> = new Map();
  private userActivities: Map<number, UserActivity> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  private rewards: Map<number, Reward> = new Map();
  private userRewards: Map<number, UserReward> = new Map();
  private referrals: Map<number, Referral> = new Map();
  
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize health pillars
    const pillars = [
      { id: 1, name: "Healthy Eating", description: "Nutrition and mindful eating habits" },
      { id: 2, name: "Movement", description: "Physical activity and exercise" },
      { id: 3, name: "Community", description: "Social connections and relationships" },
      { id: 4, name: "Nature", description: "Time outdoors and connection with nature" },
      { id: 5, name: "Mind & Relaxation", description: "Mental wellness and stress management" },
      { id: 6, name: "Sleep", description: "Quality rest and sleep hygiene" },
    ];
    
    pillars.forEach(pillar => {
      this.healthPillars.set(pillar.id, pillar);
    });

    // Initialize activities
    const activities = [
      // Morning activities
      { id: 1, title: "Morning Stretch", description: "Gentle stretching to wake up your body", duration: 5, points: 5, pillarId: 5, context: "morning", level: "beginner", isActive: true },
      { id: 2, title: "Healthy Breakfast", description: "Prepare a nutritious breakfast", duration: 10, points: 10, pillarId: 1, context: "morning", level: "beginner", isActive: true },
      { id: 3, title: "Gratitude Journal", description: "Write down 3 things you're grateful for", duration: 3, points: 5, pillarId: 5, context: "morning", level: "beginner", isActive: true },
      { id: 4, title: "Outside Walk", description: "Take a short walk outdoors", duration: 5, points: 8, pillarId: 4, context: "morning", level: "beginner", isActive: true },
      
      // Work break activities
      { id: 5, title: "Breathing Exercise", description: "Deep breathing for relaxation", duration: 3, points: 5, pillarId: 5, context: "work-break", level: "beginner", isActive: true },
      { id: 6, title: "Desk Stretches", description: "Stretch at your workspace", duration: 2, points: 3, pillarId: 2, context: "work-break", level: "beginner", isActive: true },
      
      // Evening activities
      { id: 7, title: "Evening Meditation", description: "Mindful meditation before bed", duration: 5, points: 8, pillarId: 5, context: "evening", level: "beginner", isActive: true },
      { id: 8, title: "Call a Friend", description: "Connect with someone you care about", duration: 5, points: 10, pillarId: 3, context: "evening", level: "beginner", isActive: true },
      { id: 9, title: "Sleep Routine", description: "Prepare for quality sleep", duration: 10, points: 12, pillarId: 6, context: "evening", level: "beginner", isActive: true },
    ];
    
    activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });

    // Initialize achievements
    const achievements = [
      { id: 1, name: "First Steps", description: "Complete your first activity", icon: "fas fa-baby", requirement: JSON.stringify({ activities: 1 }), points: 10 },
      { id: 2, name: "Week Warrior", description: "Complete activities for 7 days straight", icon: "fas fa-fire", requirement: JSON.stringify({ streak: 7 }), points: 50 },
      { id: 3, name: "Consistency Master", description: "Complete activities 7 days in a row", icon: "fas fa-medal", requirement: JSON.stringify({ streak: 7 }), points: 100 },
      { id: 4, name: "Nature Lover", description: "Complete 10 nature activities", icon: "fas fa-leaf", requirement: JSON.stringify({ pillar: 4, count: 10 }), points: 25 },
      { id: 5, name: "Social Butterfly", description: "Complete 5 community activities", icon: "fas fa-users", requirement: JSON.stringify({ pillar: 3, count: 5 }), points: 25 },
    ];
    
    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Initialize rewards
    const rewards = [
      { id: 1, name: "Healthy Salad", description: "Fresh organic salad from local restaurant", pointCost: 50, category: "food", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", isActive: true },
      { id: 2, name: "Yoga Class Pass", description: "Single class at local yoga studio", pointCost: 100, category: "fitness", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773", isActive: true },
      { id: 3, name: "Meditation App Subscription", description: "1-month premium meditation app", pointCost: 150, category: "wellness", imageUrl: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7", isActive: true },
    ];
    
    rewards.forEach(reward => {
      this.rewards.set(reward.id, reward);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      ...insertUser,
      onboardingComplete: false,
      newsletterOptIn: insertUser.newsletterOptIn || false,
      healthPoints: 10, // Welcome bonus
      currentStreak: 0,
      longestStreak: 0,
      level: 1,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getHealthPillars(): Promise<HealthPillar[]> {
    return Array.from(this.healthPillars.values());
  }

  async getUserPillars(userId: number): Promise<UserPillar[]> {
    return Array.from(this.userPillars.values()).filter(up => up.userId === userId);
  }

  async upsertUserPillar(data: InsertUserPillar): Promise<UserPillar> {
    const existing = Array.from(this.userPillars.values())
      .find(up => up.userId === data.userId && up.pillarId === data.pillarId);
    
    if (existing) {
      const updated = { ...existing, ...data, lastUpdated: new Date() };
      this.userPillars.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const userPillar: UserPillar = {
        id,
        ...data,
        score: data.score || 0,
        totalPoints: 0,
        lastUpdated: new Date(),
      };
      this.userPillars.set(id, userPillar);
      return userPillar;
    }
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(a => a.isActive);
  }

  async getActivitiesByContext(context: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(a => a.isActive && a.context === context);
  }

  async getUserActivitiesForDate(userId: number, date: string): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(ua => ua.userId === userId && ua.date === date);
  }

  async createUserActivity(data: InsertUserActivity): Promise<UserActivity> {
    const id = this.currentId++;
    const userActivity: UserActivity = {
      id,
      ...data,
      completedAt: new Date(),
    };
    this.userActivities.set(id, userActivity);
    return userActivity;
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(ua => ua.userId === userId);
  }

  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(r => r.isActive);
  }

  async getUserRewards(userId: number): Promise<UserReward[]> {
    return Array.from(this.userRewards.values()).filter(ur => ur.userId === userId);
  }

  async createReferral(referrerId: number, email: string): Promise<Referral> {
    const id = this.currentId++;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referral: Referral = {
      id,
      referrerId,
      refereeEmail: email,
      refereeId: null,
      code,
      status: "pending",
      pointsAwarded: 0,
      createdAt: new Date(),
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async getReferralByCode(code: string): Promise<Referral | undefined> {
    return Array.from(this.referrals.values()).find(r => r.code === code);
  }
}

export const storage = new MemStorage();
