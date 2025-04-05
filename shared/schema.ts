import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  location: text("location"),
  ecoScore: integer("eco_score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Waste categories enum
export const wasteTypeEnum = pgEnum("waste_type", [
  "plastic", 
  "paper", 
  "metal", 
  "organic", 
  "electronic", 
  "hazardous",
  "glass",
  "textile",
  "mixed",
  "other"
]);

// Waste recognition schema
export const wasteRecognitions = pgTable("waste_recognitions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  wasteType: wasteTypeEnum("waste_type").notNull(),
  weightEstimate: text("weight_estimate").notNull(),
  recyclabilityScore: integer("recyclability_score").notNull(),
  disposalMethod: text("disposal_method").notNull(),
  pointsEarned: integer("points_earned").default(15).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// CO2 Emissions schema
export const emissionsCalculations = pgTable("emissions_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vehicleYear: integer("vehicle_year").notNull(),
  fuelType: text("fuel_type").notNull(),
  distance: integer("distance").notNull(),
  emissionsAmount: text("emissions_amount").notNull(),
  pointsEarned: integer("points_earned").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Forum posts schema
export const forumCategories = pgEnum("forum_category", [
  "recycling",
  "climate_change",
  "sustainability",
  "events",
  "questions",
  "general"
]);

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: forumCategories("category").notNull(),
  likes: integer("likes").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  pointsEarned: integer("points_earned").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Forum comments schema
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  pointsEarned: integer("points_earned").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Product schema for marketplace
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  tag: text("tag").notNull(),
  tagline: text("tagline").notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// User activity schema
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(),
  description: text("description").notNull(),
  pointsEarned: integer("points_earned").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  location: true,
});

export const insertWasteRecognitionSchema = createInsertSchema(wasteRecognitions).pick({
  userId: true,
  imageUrl: true,
  wasteType: true,
  weightEstimate: true,
  recyclabilityScore: true,
  disposalMethod: true,
});

export const insertEmissionsCalculationSchema = createInsertSchema(emissionsCalculations).pick({
  userId: true,
  vehicleMake: true,
  vehicleModel: true,
  vehicleYear: true,
  fuelType: true,
  distance: true,
  emissionsAmount: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  userId: true,
  title: true,
  content: true,
  category: true,
});

export const insertForumCommentSchema = createInsertSchema(forumComments).pick({
  postId: true,
  userId: true,
  content: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  tag: true,
  tagline: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  activityType: true,
  description: true,
  pointsEarned: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WasteRecognition = typeof wasteRecognitions.$inferSelect;
export type InsertWasteRecognition = z.infer<typeof insertWasteRecognitionSchema>;

export type EmissionsCalculation = typeof emissionsCalculations.$inferSelect;
export type InsertEmissionsCalculation = z.infer<typeof insertEmissionsCalculationSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
