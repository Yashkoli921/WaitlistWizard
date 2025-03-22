import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validatedData = insertWaitlistSchema.parse({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        plan: req.body.plan,
        consentToUpdates: req.body.consent,
      });
      
      // Store the waitlist entry
      const waitlistEntry = await storage.createWaitlistEntry(validatedData);
      
      // Return the created entry
      return res.status(201).json({
        message: "Successfully joined the waitlist",
        data: waitlistEntry
      });
    } catch (error) {
      console.error("Error creating waitlist entry:", error);
      
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        message: "Error joining waitlist"
      });
    }
  });
  
  // Save calculation history
  app.post("/api/history", async (req, res) => {
    try {
      const { calculationType, input, result } = req.body;
      
      // Store the calculation history
      const historyEntry = await storage.saveCalculationHistory({
        calculationType,
        input,
        result,
        userId: null // Guest user (not authenticated)
      });
      
      return res.status(201).json({
        message: "Calculation history saved",
        data: historyEntry
      });
    } catch (error) {
      console.error("Error saving calculation history:", error);
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

  return httpServer;
}
