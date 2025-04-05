import {
  users, User, InsertUser, 
  wasteRecognitions, WasteRecognition, InsertWasteRecognition,
  emissionsCalculations, EmissionsCalculation, InsertEmissionsCalculation,
  forumPosts, ForumPost, InsertForumPost,
  forumComments, ForumComment, InsertForumComment,
  products, Product, InsertProduct,
  userActivities, UserActivity, InsertUserActivity
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserScore(userId: number, additionalPoints: number): Promise<void>;
  
  // Waste recognition operations
  createWasteRecognition(recognition: InsertWasteRecognition): Promise<WasteRecognition>;
  getWasteRecognitionsByUserId(userId: number): Promise<WasteRecognition[]>;
  
  // Emissions calculations operations
  createEmissionsCalculation(calculation: InsertEmissionsCalculation): Promise<EmissionsCalculation>;
  getEmissionsCalculationsByUserId(userId: number): Promise<EmissionsCalculation[]>;
  
  // Forum operations
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPosts(limit?: number, offset?: number): Promise<ForumPost[]>;
  getForumPostById(id: number): Promise<ForumPost | undefined>;
  updateForumPostLikes(postId: number, increment: boolean): Promise<void>;
  
  // Forum comments operations
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  getCommentsByPostId(postId: number): Promise<ForumComment[]>;
  
  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  
  // User activity operations
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivitiesByUserId(userId: number, limit?: number): Promise<UserActivity[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wasteRecognitions: Map<number, WasteRecognition>;
  private emissionsCalculations: Map<number, EmissionsCalculation>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private products: Map<number, Product>;
  private userActivities: Map<number, UserActivity>;
  
  private currentUserId: number;
  private currentWasteRecognitionId: number;
  private currentEmissionsCalculationId: number;
  private currentForumPostId: number;
  private currentForumCommentId: number;
  private currentProductId: number;
  private currentUserActivityId: number;

  constructor() {
    this.users = new Map();
    this.wasteRecognitions = new Map();
    this.emissionsCalculations = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.products = new Map();
    this.userActivities = new Map();
    
    this.currentUserId = 1;
    this.currentWasteRecognitionId = 1;
    this.currentEmissionsCalculationId = 1;
    this.currentForumPostId = 1;
    this.currentForumCommentId = 1;
    this.currentProductId = 1;
    this.currentUserActivityId = 1;
    
    // Initialize with some products
    this.initializeProducts();
    // Initialize with some forum posts
    this.initializeForumPosts();
  }

  // Initialize some example products
  private initializeProducts(): void {
    const productsData: InsertProduct[] = [
      {
        name: "Reusable Water Bottle",
        description: "Stainless steel, BPA-free, keeps drinks cold for 24 hours or hot for 12 hours.",
        price: "$24.99",
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Kitchen",
        tag: "Eco-Friendly",
        tagline: "15% of proceeds donated to ocean cleanup"
      },
      {
        name: "Bamboo Cutlery Set",
        description: "Portable utensil set including fork, knife, spoon, and chopsticks in a canvas pouch.",
        price: "$18.50",
        imageUrl: "https://images.unsplash.com/photo-1531951657915-3c3f05e75497?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Kitchen",
        tag: "Biodegradable",
        tagline: "Plastic-free packaging"
      },
      {
        name: "Reusable Produce Bags (Set of 5)",
        description: "Organic cotton mesh bags for grocery shopping. Machine washable and durable.",
        price: "$12.99",
        imageUrl: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Kitchen",
        tag: "Zero Waste",
        tagline: "Fair trade certified"
      },
      {
        name: "Compostable Phone Case",
        description: "Made from plant-based materials. Fully compostable at end of life.",
        price: "$29.95",
        imageUrl: "https://images.unsplash.com/photo-1556228578-6cca4e9ae56d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Electronics",
        tag: "Biodegradable",
        tagline: "Carbon-neutral shipping"
      },
      {
        name: "Organic Cotton Tote Bag",
        description: "Heavy-duty organic cotton canvas. Natural dyes, ethically produced.",
        price: "$15.00",
        imageUrl: "https://images.unsplash.com/photo-1557431177-36141475c676?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Bags",
        tag: "Eco-Friendly",
        tagline: "Supports artisan craftspeople"
      },
      {
        name: "Beeswax Food Wraps (Set of 3)",
        description: "Reusable alternative to plastic wrap. Handmade with organic cotton and beeswax.",
        price: "$22.50",
        imageUrl: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Kitchen",
        tag: "Zero Waste",
        tagline: "Lasts up to one year"
      }
    ];
    
    productsData.forEach(product => {
      const id = this.currentProductId++;
      const newProduct: Product = { 
        ...product, 
        id, 
        inStock: true, 
        createdAt: new Date() 
      };
      this.products.set(id, newProduct);
    });
  }
  
  // Initialize some example forum posts
  private initializeForumPosts(): void {
    // We'll add forum posts if a user exists (demo only)
    const demoUser: InsertUser = {
      username: "ecomaster",
      password: "password123",
      email: "ecomaster@example.com",
      fullName: "Eco Master",
      location: "Earth"
    };
    
    this.createUser(demoUser).then(user => {
      const postsData: InsertForumPost[] = [
        {
          userId: user.id,
          title: "Simple ways to reduce plastic waste",
          content: "I've been trying to reduce my plastic waste footprint and wanted to share some simple techniques that have worked well for me...",
          category: "recycling"
        },
        {
          userId: user.id,
          title: "Community cleanup event this weekend in London",
          content: "We're organizing a community cleanup this weekend at Hyde Park. Everyone is welcome to join! We'll provide gloves and collection bags...",
          category: "events"
        },
        {
          userId: user.id,
          title: "How accurate is the CO₂ calculator?",
          content: "I've been using the CO₂ calculator and I'm wondering how accurate it is for different vehicle types. Has anyone compared the results with other tools?",
          category: "questions"
        }
      ];
      
      postsData.forEach(post => {
        this.createForumPost(post);
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Make sure to handle optional fields correctly
    const user: User = { 
      id, 
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName || null,
      location: insertUser.location || null,
      ecoScore: 0, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserScore(userId: number, additionalPoints: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      const updatedUser = {
        ...user,
        ecoScore: user.ecoScore + additionalPoints
      };
      this.users.set(userId, updatedUser);
    }
  }
  
  // Waste recognition operations
  async createWasteRecognition(recognition: InsertWasteRecognition): Promise<WasteRecognition> {
    const id = this.currentWasteRecognitionId++;
    const newRecognition: WasteRecognition = {
      ...recognition,
      id,
      pointsEarned: 15,
      createdAt: new Date()
    };
    this.wasteRecognitions.set(id, newRecognition);
    
    // Update user score
    await this.updateUserScore(recognition.userId, 15);
    
    // Create an activity
    await this.createUserActivity({
      userId: recognition.userId,
      activityType: 'waste_recognition',
      description: `Recognized ${recognition.wasteType} waste`,
      pointsEarned: 15
    });
    
    return newRecognition;
  }
  
  async getWasteRecognitionsByUserId(userId: number): Promise<WasteRecognition[]> {
    return Array.from(this.wasteRecognitions.values())
      .filter(recognition => recognition.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Emissions calculations operations
  async createEmissionsCalculation(calculation: InsertEmissionsCalculation): Promise<EmissionsCalculation> {
    const id = this.currentEmissionsCalculationId++;
    const newCalculation: EmissionsCalculation = {
      ...calculation,
      id,
      pointsEarned: 10,
      createdAt: new Date()
    };
    this.emissionsCalculations.set(id, newCalculation);
    
    // Update user score
    await this.updateUserScore(calculation.userId, 10);
    
    // Create an activity
    await this.createUserActivity({
      userId: calculation.userId,
      activityType: 'emissions_calculation',
      description: `Calculated emissions for ${calculation.vehicleMake} ${calculation.vehicleModel}`,
      pointsEarned: 10
    });
    
    return newCalculation;
  }
  
  async getEmissionsCalculationsByUserId(userId: number): Promise<EmissionsCalculation[]> {
    return Array.from(this.emissionsCalculations.values())
      .filter(calculation => calculation.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Forum operations
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const id = this.currentForumPostId++;
    const newPost: ForumPost = {
      ...post,
      id,
      likes: 0,
      commentCount: 0,
      pointsEarned: 5,
      createdAt: new Date()
    };
    this.forumPosts.set(id, newPost);
    
    // Update user score
    await this.updateUserScore(post.userId, 5);
    
    // Create an activity
    await this.createUserActivity({
      userId: post.userId,
      activityType: 'forum_post',
      description: `Created forum post: ${post.title}`,
      pointsEarned: 5
    });
    
    return newPost;
  }
  
  async getForumPosts(limit = 10, offset = 0): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }
  
  async updateForumPostLikes(postId: number, increment: boolean): Promise<void> {
    const post = await this.getForumPostById(postId);
    if (post) {
      const updatedPost = {
        ...post,
        likes: increment ? post.likes + 1 : post.likes - 1
      };
      this.forumPosts.set(postId, updatedPost);
    }
  }
  
  // Forum comments operations
  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const id = this.currentForumCommentId++;
    const newComment: ForumComment = {
      ...comment,
      id,
      pointsEarned: 2,
      createdAt: new Date()
    };
    this.forumComments.set(id, newComment);
    
    // Update comment count on post
    const post = await this.getForumPostById(comment.postId);
    if (post) {
      const updatedPost = {
        ...post,
        commentCount: post.commentCount + 1
      };
      this.forumPosts.set(comment.postId, updatedPost);
    }
    
    // Update user score
    await this.updateUserScore(comment.userId, 2);
    
    // Create an activity
    await this.createUserActivity({
      userId: comment.userId,
      activityType: 'forum_comment',
      description: 'Commented on a forum post',
      pointsEarned: 2
    });
    
    return newComment;
  }
  
  async getCommentsByPostId(postId: number): Promise<ForumComment[]> {
    return Array.from(this.forumComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Product operations
  async getProducts(limit = 10, offset = 0): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.inStock)
      .slice(offset, offset + limit);
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  // User activity operations
  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const id = this.currentUserActivityId++;
    // Make sure to handle optional fields correctly
    const newActivity: UserActivity = {
      id,
      userId: activity.userId,
      activityType: activity.activityType,
      description: activity.description,
      pointsEarned: activity.pointsEarned || 0,
      createdAt: new Date()
    };
    this.userActivities.set(id, newActivity);
    return newActivity;
  }
  
  async getUserActivitiesByUserId(userId: number, limit = 5): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

// Export MemStorage as an option, but use DatabaseStorage as the default implementation
import { db } from './db';
import { eq, desc, like, sql } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure optional fields are handled properly
    const userWithDefaults = {
      ...insertUser,
      fullName: insertUser.fullName || null,
      location: insertUser.location || null
    };
    
    const [user] = await db.insert(users).values(userWithDefaults).returning();
    return user;
  }

  async updateUserScore(userId: number, additionalPoints: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    await db.update(users)
      .set({ ecoScore: user.ecoScore + additionalPoints })
      .where(eq(users.id, userId));
  }

  async createWasteRecognition(recognition: InsertWasteRecognition): Promise<WasteRecognition> {
    const [result] = await db.insert(wasteRecognitions).values(recognition).returning();
    return result;
  }

  async getWasteRecognitionsByUserId(userId: number): Promise<WasteRecognition[]> {
    return await db.select()
      .from(wasteRecognitions)
      .where(eq(wasteRecognitions.userId, userId))
      .orderBy(desc(wasteRecognitions.createdAt));
  }

  async createEmissionsCalculation(calculation: InsertEmissionsCalculation): Promise<EmissionsCalculation> {
    const [result] = await db.insert(emissionsCalculations).values(calculation).returning();
    return result;
  }

  async getEmissionsCalculationsByUserId(userId: number): Promise<EmissionsCalculation[]> {
    return await db.select()
      .from(emissionsCalculations)
      .where(eq(emissionsCalculations.userId, userId))
      .orderBy(desc(emissionsCalculations.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [result] = await db.insert(forumPosts).values(post).returning();
    return result;
  }

  async getForumPosts(limit = 10, offset = 0): Promise<ForumPost[]> {
    return await db.select()
      .from(forumPosts)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(forumPosts.createdAt));
  }

  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post;
  }

  async updateForumPostLikes(postId: number, increment: boolean): Promise<void> {
    const post = await this.getForumPostById(postId);
    if (!post) {
      throw new Error('Forum post not found');
    }
    
    await db.update(forumPosts)
      .set({ likes: increment ? post.likes + 1 : Math.max(0, post.likes - 1) })
      .where(eq(forumPosts.id, postId));
  }

  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const [result] = await db.insert(forumComments).values(comment).returning();
    return result;
  }

  async getCommentsByPostId(postId: number): Promise<ForumComment[]> {
    return await db.select()
      .from(forumComments)
      .where(eq(forumComments.postId, postId))
      .orderBy(desc(forumComments.createdAt));
  }

  async getProducts(limit = 10, offset = 0): Promise<Product[]> {
    return await db.select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    // Ensure optional fields are handled properly
    const activityWithDefaults = {
      ...activity,
      pointsEarned: activity.pointsEarned !== undefined ? activity.pointsEarned : 0
    };
    
    const [result] = await db.insert(userActivities).values(activityWithDefaults).returning();
    return result;
  }

  async getUserActivitiesByUserId(userId: number, limit = 5): Promise<UserActivity[]> {
    return await db.select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .limit(limit)
      .orderBy(desc(userActivities.createdAt));
  }
}

// Use DatabaseStorage as the default implementation
export const storage = new DatabaseStorage();
