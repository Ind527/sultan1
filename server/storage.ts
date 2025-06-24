import { eq, desc, asc, and, like, count } from "drizzle-orm";
import { db } from "./db.js";
import { 
  users, categories, products, quotes, contactMessages,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Quote, type InsertQuote,
  type ContactMessage, type InsertContactMessage
} from "../shared/schema.js";
import session from "express-session";
import MemoryStore from "memorystore";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Product methods
  getProducts(params?: { 
    search?: string; 
    categoryId?: number; 
    isActive?: boolean; 
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'createdAt' | 'rating' | 'viewCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  incrementProductView(id: number): Promise<void>;

  // Quote methods
  getQuotes(params?: { status?: string; limit?: number; offset?: number }): Promise<{ quotes: Quote[]; total: number }>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, quote: Partial<Quote>): Promise<Quote>;
  deleteQuote(id: number): Promise<void>;

  // Contact message methods
  getContactMessages(params?: { status?: string; limit?: number; offset?: number }): Promise<{ messages: ContactMessage[]; total: number }>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: number, message: Partial<ContactMessage>): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<void>;

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const MemStore = MemoryStore(session);
    this.sessionStore = new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateUser)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, updateCategory: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(updateCategory)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getProducts(params?: { 
    search?: string; 
    categoryId?: number; 
    isActive?: boolean; 
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'createdAt' | 'rating' | 'viewCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number }> {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    
    let whereConditions = [];
    
    if (params?.search) {
      whereConditions.push(like(products.name, `%${params.search}%`));
    }
    
    if (params?.categoryId !== undefined) {
      whereConditions.push(eq(products.categoryId, params.categoryId));
    }
    
    if (params?.isActive !== undefined) {
      whereConditions.push(eq(products.isActive, params.isActive));
    }
    
    if (params?.isFeatured !== undefined) {
      whereConditions.push(eq(products.isFeatured, params.isFeatured));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    let orderBy;
    const sortOrder = params?.sortOrder || 'desc';
    switch (params?.sortBy) {
      case 'name':
        orderBy = sortOrder === 'asc' ? asc(products.name) : desc(products.name);
        break;
      case 'rating':
        orderBy = sortOrder === 'asc' ? asc(products.rating) : desc(products.rating);
        break;
      case 'viewCount':
        orderBy = sortOrder === 'asc' ? asc(products.viewCount) : desc(products.viewCount);
        break;
      default:
        orderBy = sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt);
    }

    const [productsResult, countResult] = await Promise.all([
      db.select()
        .from(products)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() })
        .from(products)
        .where(whereClause)
    ]);

    return {
      products: productsResult,
      total: countResult[0].count
    };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const productData: any = insertProduct;
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateProduct: Partial<InsertProduct>): Promise<Product> {
    const updateData: any = updateProduct;
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async incrementProductView(id: number): Promise<void> {
    await db
      .update(products)
      .set({ viewCount: 1 })
      .where(eq(products.id, id));
  }

  async getQuotes(params?: { status?: string; limit?: number; offset?: number }): Promise<{ quotes: Quote[]; total: number }> {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    
    let whereConditions = [];
    
    if (params?.status) {
      whereConditions.push(eq(quotes.status, params.status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [quotesResult, countResult] = await Promise.all([
      db.select()
        .from(quotes)
        .where(whereClause)
        .orderBy(desc(quotes.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() })
        .from(quotes)
        .where(whereClause)
    ]);

    return {
      quotes: quotesResult,
      total: countResult[0].count
    };
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  async updateQuote(id: number, updateQuote: Partial<Quote>): Promise<Quote> {
    const [quote] = await db
      .update(quotes)
      .set(updateQuote)
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }

  async deleteQuote(id: number): Promise<void> {
    await db.delete(quotes).where(eq(quotes.id, id));
  }

  async getContactMessages(params?: { status?: string; limit?: number; offset?: number }): Promise<{ messages: ContactMessage[]; total: number }> {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    
    let whereConditions = [];
    
    if (params?.status) {
      whereConditions.push(eq(contactMessages.status, params.status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [messagesResult, countResult] = await Promise.all([
      db.select()
        .from(contactMessages)
        .where(whereClause)
        .orderBy(desc(contactMessages.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() })
        .from(contactMessages)
        .where(whereClause)
    ]);

    return {
      messages: messagesResult,
      total: countResult[0].count
    };
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async updateContactMessage(id: number, updateMessage: Partial<ContactMessage>): Promise<ContactMessage> {
    const [message] = await db
      .update(contactMessages)
      .set(updateMessage)
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async initSampleData() {
    try {
      // Check if we already have data
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return; // Data already exists
      }

      // Create sample categories
      const [grainCategory] = await db.insert(categories).values({
        name: "Grains & Cereals",
        description: "High-quality grains and cereals for export",
        slug: "grains-cereals"
      }).returning();

      const [spiceCategory] = await db.insert(categories).values({
        name: "Spices & Herbs", 
        description: "Premium spices and herbs from around the world",
        slug: "spices-herbs"
      }).returning();

      const [fruitCategory] = await db.insert(categories).values({
        name: "Fruits & Vegetables",
        description: "Fresh and dried fruits and vegetables",
        slug: "fruits-vegetables"
      }).returning();

      // Create a few sample products
      await db.insert(products).values([
        {
          name: "Premium Basmati Rice",
          slug: "premium-basmati-rice",
          shortDescription: "Long-grain aromatic rice with exceptional quality",
          description: "Our Premium Basmati Rice is sourced from the finest fields and processed using state-of-the-art technology.",
          images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
          categoryId: grainCategory.id,
          weight: "25kg, 50kg bags",
          volume: "1000+ tons/month",
          isActive: true,
          isFeatured: true,
          rating: "4.8"
        },
        {
          name: "Organic Black Pepper",
          slug: "organic-black-pepper", 
          shortDescription: "Premium organic black pepper with rich flavor",
          description: "Our Organic Black Pepper is sourced from sustainable farms and processed with traditional methods.",
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
          categoryId: spiceCategory.id,
          weight: "1kg, 5kg, 25kg",
          volume: "500+ tons/month",
          isActive: true,
          isFeatured: true,
          rating: "4.9"
        },
        {
          name: "Fresh Dragon Fruit",
          slug: "fresh-dragon-fruit",
          shortDescription: "Exotic dragon fruit with exceptional sweetness", 
          description: "Our Fresh Dragon Fruit is carefully harvested from premium orchards and handled with advanced cold chain technology.",
          images: ["https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
          categoryId: fruitCategory.id,
          weight: "2-5kg per box",
          volume: "200+ tons/month",
          brixLevel: "18-22°",
          isActive: true,
          isFeatured: true,
          rating: "4.7"
        }
      ]);

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export const storage = new DatabaseStorage();