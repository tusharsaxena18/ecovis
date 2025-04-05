import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWasteRecognitionSchema,
  insertEmissionsCalculationSchema,
  insertForumPostSchema,
  insertForumCommentSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.format() });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't return the password
      const { password: userPassword, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/users/:id/activities", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activities = await storage.getUserActivitiesByUserId(userId);
      
      return res.status(200).json(activities);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user activities" });
    }
  });

  // Waste recognition routes
  app.post("/api/waste-recognition", async (req: Request, res: Response) => {
    try {
      const recognitionData = insertWasteRecognitionSchema.parse(req.body);
      
      const user = await storage.getUser(recognitionData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const recognition = await storage.createWasteRecognition(recognitionData);
      
      return res.status(201).json(recognition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid waste recognition data", errors: error.format() });
      }
      return res.status(500).json({ message: "Failed to create waste recognition" });
    }
  });

  app.get("/api/users/:id/waste-recognitions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const recognitions = await storage.getWasteRecognitionsByUserId(userId);
      
      return res.status(200).json(recognitions);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get waste recognitions" });
    }
  });

  // Emissions calculation routes
  app.post("/api/emissions-calculations", async (req: Request, res: Response) => {
    try {
      const calculationData = insertEmissionsCalculationSchema.parse(req.body);
      
      const user = await storage.getUser(calculationData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const calculation = await storage.createEmissionsCalculation(calculationData);
      
      return res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid emissions calculation data", errors: error.format() });
      }
      return res.status(500).json({ message: "Failed to create emissions calculation" });
    }
  });

  app.get("/api/users/:id/emissions-calculations", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const calculations = await storage.getEmissionsCalculationsByUserId(userId);
      
      return res.status(200).json(calculations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get emissions calculations" });
    }
  });

  // Forum routes
  app.post("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      
      const user = await storage.getUser(postData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const post = await storage.createForumPost(postData);
      
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid forum post data", errors: error.format() });
      }
      return res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  app.get("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getForumPosts(limit, offset);
      
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get forum posts" });
    }
  });

  app.get("/api/forum/posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getForumPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get forum post" });
    }
  });

  app.post("/api/forum/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getForumPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      await storage.updateForumPostLikes(postId, true);
      
      return res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.post("/api/forum/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getForumPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const commentData = insertForumCommentSchema.parse({
        ...req.body,
        postId
      });
      
      const user = await storage.getUser(commentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const comment = await storage.createForumComment(commentData);
      
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.format() });
      }
      return res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get("/api/forum/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getForumPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comments = await storage.getCommentsByPostId(postId);
      
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get comments" });
    }
  });

  // Product routes
  app.get("/api/marketplace/products", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const products = await storage.getProducts(limit, offset);
      
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/marketplace/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get product" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
