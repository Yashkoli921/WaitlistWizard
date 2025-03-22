import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { 
  insertWaitlistSchema, 
  insertCalculationSchema 
} from "@shared/schema";
import { formatZodError } from "zod-validation-error";
import * as math from "mathjs";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Health check endpoint
  apiRouter.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Waitlist endpoint
  apiRouter.post('/waitlist', async (req: Request, res: Response) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistByEmail(waitlistData.email);
      if (existingEntry) {
        return res.status(400).json({ message: 'Email already registered on waitlist' });
      }
      
      const result = await storage.addToWaitlist(waitlistData);
      res.status(201).json({ 
        message: 'Successfully added to waitlist',
        id: result.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: 'Invalid input data', 
          errors: formatZodError(error) 
        });
      } else {
        console.error('Waitlist error:', error);
        res.status(500).json({ message: 'Server error adding to waitlist' });
      }
    }
  });

  // Basic calculation endpoint
  apiRouter.post('/calculate', async (req: Request, res: Response) => {
    try {
      const { expression, type } = req.body;
      
      if (!expression || !type) {
        return res.status(400).json({ message: 'Expression and type are required' });
      }
      
      // Handle different calculation types
      let result;
      
      try {
        // Use mathjs to safely evaluate the expression
        result = math.evaluate(expression);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid expression', error: err.message });
      }
      
      // If user is logged in, save the calculation
      if (req.body.userId) {
        try {
          const calculationData = insertCalculationSchema.parse({
            userId: req.body.userId,
            type,
            input: expression,
            result: result.toString(),
            timestamp: new Date().toISOString()
          });
          
          await storage.saveCalculation(calculationData);
        } catch (calcError) {
          console.error('Error saving calculation:', calcError);
          // Continue even if saving fails
        }
      }
      
      res.json({ result });
    } catch (error) {
      console.error('Calculation error:', error);
      res.status(500).json({ message: 'Server error processing calculation' });
    }
  });

  // Financial calculations endpoint
  apiRouter.post('/financial-calculate', async (req: Request, res: Response) => {
    try {
      const { type, params } = req.body;
      
      if (!type || !params) {
        return res.status(400).json({ message: 'Type and parameters are required' });
      }
      
      let result;
      
      switch (type) {
        case 'loan':
          // Calculate loan payment: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
          if (!params.principal || !params.rate || !params.term) {
            return res.status(400).json({ message: 'Principal, rate, and term are required for loan calculation' });
          }
          
          const principal = parseFloat(params.principal);
          const monthlyRate = parseFloat(params.rate) / 100 / 12;
          const terms = parseFloat(params.term) * 12;
          
          result = principal * monthlyRate * Math.pow(1 + monthlyRate, terms) / (Math.pow(1 + monthlyRate, terms) - 1);
          break;
          
        case 'investment':
          // Future value calculation: FV = PV * (1 + r)^n
          if (!params.principal || !params.rate || !params.term) {
            return res.status(400).json({ message: 'Principal, rate, and term are required for investment calculation' });
          }
          
          const investAmount = parseFloat(params.principal);
          const annualRate = parseFloat(params.rate) / 100;
          const years = parseFloat(params.term);
          
          result = investAmount * Math.pow(1 + annualRate, years);
          break;
          
        case 'roi':
          // ROI calculation: ROI = (Gain - Cost) / Cost * 100
          if (!params.gain || !params.cost) {
            return res.status(400).json({ message: 'Gain and cost are required for ROI calculation' });
          }
          
          const gain = parseFloat(params.gain);
          const cost = parseFloat(params.cost);
          
          result = ((gain - cost) / cost) * 100;
          break;
          
        default:
          return res.status(400).json({ message: 'Unsupported financial calculation type' });
      }
      
      // Save calculation if user is logged in
      if (req.body.userId) {
        try {
          const calculationData = insertCalculationSchema.parse({
            userId: req.body.userId,
            type: 'financial',
            input: JSON.stringify(params),
            result: result.toString(),
            timestamp: new Date().toISOString()
          });
          
          await storage.saveCalculation(calculationData);
        } catch (calcError) {
          console.error('Error saving financial calculation:', calcError);
        }
      }
      
      res.json({ result });
    } catch (error) {
      console.error('Financial calculation error:', error);
      res.status(500).json({ message: 'Server error processing financial calculation' });
    }
  });

  // Get user calculation history
  apiRouter.get('/calculations/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const calculations = await storage.getUserCalculations(userId);
      res.json(calculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      res.status(500).json({ message: 'Server error fetching calculations' });
    }
  });

  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
