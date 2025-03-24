import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationHistorySchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Save calculation history
  app.post("/api/history", async (req, res) => {
    try {
      const { calculationType, input, result } = req.body;
      
      // Validate request body using Zod schema
      const validatedData = insertCalculationHistorySchema.parse({
        calculationType,
        input,
        result,
        userId: null // Guest user (not authenticated)
      });
      
      // Store the calculation history
      const historyEntry = await storage.saveCalculationHistory(validatedData);
      
      return res.status(201).json({
        message: "Calculation history saved",
        data: historyEntry
      });
    } catch (error) {
      console.error("Error saving calculation history:", error);
      
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({
        message: "Error saving calculation history"
      });
    }
  });
  
  // Get calculation history (this would typically be authenticated)
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getCalculationHistory();
      
      return res.status(200).json({
        data: history
      });
    } catch (error) {
      console.error("Error retrieving calculation history:", error);
      return res.status(500).json({
        message: "Error retrieving calculation history"
      });
    }
  });

  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ 
        username: email,
        password: hashedPassword 
      });
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.status(201).json({ token });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  });

  return httpServer;
}
