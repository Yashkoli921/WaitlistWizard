import { users, type User, type InsertUser, type InsertCalculationHistory, type CalculationHistory } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveCalculationHistory(calculation: InsertCalculationHistory): Promise<CalculationHistory>;
  getCalculationHistory(userId?: number): Promise<CalculationHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculationHistory: Map<number, CalculationHistory>;
  currentId: number;
  historyId: number;

  constructor() {
    this.users = new Map();
    this.calculationHistory = new Map();
    this.currentId = 1;
    this.historyId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveCalculationHistory(calculation: InsertCalculationHistory): Promise<CalculationHistory> {
    const id = this.historyId++;
    const createdAt = new Date();
    // Ensure userId is null if undefined
    const userId = calculation.userId === undefined ? null : calculation.userId;
    
    const history: CalculationHistory = { 
      id,
      userId,
      calculationType: calculation.calculationType,
      input: calculation.input,
      result: calculation.result,
      createdAt
    };
    this.calculationHistory.set(id, history);
    return history;
  }

  async getCalculationHistory(userId?: number): Promise<CalculationHistory[]> {
    const allHistory = Array.from(this.calculationHistory.values());
    if (userId) {
      return allHistory.filter(h => h.userId === userId);
    }
    return allHistory;
  }
}

export const storage = new MemStorage();
