var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage.ts
import { eq, desc, asc, and, like, count } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  contactMessages: () => contactMessages,
  insertCategorySchema: () => insertCategorySchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertProductSchema: () => insertProductSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertUserSchema: () => insertUserSchema,
  products: () => products,
  productsRelations: () => productsRelations,
  quotes: () => quotes,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
  // admin, editor, viewer
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  categoryId: integer("category_id").references(() => categories.id),
  images: json("images").$type().default([]),
  specifications: json("specifications").$type().default({}),
  volume: text("volume"),
  // e.g., "20-40 tons/month"
  weight: text("weight"),
  // e.g., "18-25 kg/box"
  brixLevel: text("brix_level"),
  // for fruits
  price: text("price").default("Request Quote"),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  country: text("country").notNull(),
  productCategory: text("product_category"),
  productDetails: text("product_details").notNull(),
  estimatedQuantity: text("estimated_quantity"),
  deliveryPort: text("delivery_port"),
  status: text("status").notNull().default("pending"),
  // pending, processed, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  // unread, read, replied
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));
var productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  notes: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  status: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import session from "express-session";
import MemoryStore from "memorystore";
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    const MemStore = MemoryStore(session);
    this.sessionStore = new MemStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updateUser) {
    const [user] = await db.update(users).set(updateUser).where(eq(users.id, id)).returning();
    return user;
  }
  async getCategories() {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }
  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || void 0;
  }
  async createCategory(insertCategory) {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
  async updateCategory(id, updateCategory) {
    const [category] = await db.update(categories).set(updateCategory).where(eq(categories.id, id)).returning();
    return category;
  }
  async deleteCategory(id) {
    await db.delete(categories).where(eq(categories.id, id));
  }
  async getProducts(params) {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    let whereConditions = [];
    if (params?.search) {
      whereConditions.push(like(products.name, `%${params.search}%`));
    }
    if (params?.categoryId !== void 0) {
      whereConditions.push(eq(products.categoryId, params.categoryId));
    }
    if (params?.isActive !== void 0) {
      whereConditions.push(eq(products.isActive, params.isActive));
    }
    if (params?.isFeatured !== void 0) {
      whereConditions.push(eq(products.isFeatured, params.isFeatured));
    }
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : void 0;
    let orderBy;
    const sortOrder = params?.sortOrder || "desc";
    switch (params?.sortBy) {
      case "name":
        orderBy = sortOrder === "asc" ? asc(products.name) : desc(products.name);
        break;
      case "rating":
        orderBy = sortOrder === "asc" ? asc(products.rating) : desc(products.rating);
        break;
      case "viewCount":
        orderBy = sortOrder === "asc" ? asc(products.viewCount) : desc(products.viewCount);
        break;
      default:
        orderBy = sortOrder === "asc" ? asc(products.createdAt) : desc(products.createdAt);
    }
    const [productsResult, countResult] = await Promise.all([
      db.select().from(products).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db.select({ count: count() }).from(products).where(whereClause)
    ]);
    return {
      products: productsResult,
      total: countResult[0].count
    };
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async getProductBySlug(slug) {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || void 0;
  }
  async createProduct(insertProduct) {
    const productData = insertProduct;
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }
  async updateProduct(id, updateProduct) {
    const updateData = updateProduct;
    const [product] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return product;
  }
  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, id));
  }
  async incrementProductView(id) {
    await db.update(products).set({ viewCount: 1 }).where(eq(products.id, id));
  }
  async getQuotes(params) {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    let whereConditions = [];
    if (params?.status) {
      whereConditions.push(eq(quotes.status, params.status));
    }
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : void 0;
    const [quotesResult, countResult] = await Promise.all([
      db.select().from(quotes).where(whereClause).orderBy(desc(quotes.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(quotes).where(whereClause)
    ]);
    return {
      quotes: quotesResult,
      total: countResult[0].count
    };
  }
  async getQuote(id) {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || void 0;
  }
  async createQuote(insertQuote) {
    const [quote] = await db.insert(quotes).values(insertQuote).returning();
    return quote;
  }
  async updateQuote(id, updateQuote) {
    const [quote] = await db.update(quotes).set(updateQuote).where(eq(quotes.id, id)).returning();
    return quote;
  }
  async deleteQuote(id) {
    await db.delete(quotes).where(eq(quotes.id, id));
  }
  async getContactMessages(params) {
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    let whereConditions = [];
    if (params?.status) {
      whereConditions.push(eq(contactMessages.status, params.status));
    }
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : void 0;
    const [messagesResult, countResult] = await Promise.all([
      db.select().from(contactMessages).where(whereClause).orderBy(desc(contactMessages.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(contactMessages).where(whereClause)
    ]);
    return {
      messages: messagesResult,
      total: countResult[0].count
    };
  }
  async createContactMessage(insertMessage) {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }
  async updateContactMessage(id, updateMessage) {
    const [message] = await db.update(contactMessages).set(updateMessage).where(eq(contactMessages.id, id)).returning();
    return message;
  }
  async deleteContactMessage(id) {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }
  async initSampleData() {
    try {
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return;
      }
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
          brixLevel: "18-22\xB0",
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
};
var storage = new DatabaseStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
import { z } from "zod";
function registerRoutes(app2) {
  setupAuth(app2);
  const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };
  const requireAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  app2.put("/api/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  app2.delete("/api/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const {
        search,
        categoryId,
        isActive,
        isFeatured,
        page = "1",
        limit = "20",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await storage.getProducts({
        search,
        categoryId: categoryId ? parseInt(categoryId) : void 0,
        isActive: isActive === "true" ? true : isActive === "false" ? false : void 0,
        isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : void 0,
        limit: parseInt(limit),
        offset,
        sortBy,
        sortOrder
      });
      res.json({
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await storage.incrementProductView(id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const product = await storage.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await storage.incrementProductView(product.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/quotes", requireAuth, async (req, res) => {
    try {
      const { status, page = "1", limit = "20" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await storage.getQuotes({
        status,
        limit: parseInt(limit),
        offset
      });
      res.json({
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  app2.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });
  app2.put("/api/quotes/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.updateQuote(id, req.body);
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quote" });
    }
  });
  app2.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuote(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quote" });
    }
  });
  app2.get("/api/contact-messages", requireAuth, async (req, res) => {
    try {
      const { status, page = "1", limit = "20" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await storage.getContactMessages({
        status,
        limit: parseInt(limit),
        offset
      });
      res.json({
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  app2.post("/api/contact-messages", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  app2.put("/api/contact-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.updateContactMessage(id, req.body);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });
  app2.delete("/api/contact-messages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContactMessage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });
  app2.get("/api/search/suggestions", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string" || q.length < 2) {
        return res.json([]);
      }
      const result = await storage.getProducts({
        search: q,
        isActive: true,
        limit: 5
      });
      const suggestions = result.products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.categoryId
      }));
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await storage.initSampleData();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
