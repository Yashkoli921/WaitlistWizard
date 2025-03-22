import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationHistorySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

  return httpServer;
}
