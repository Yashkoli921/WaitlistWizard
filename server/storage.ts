import { 
  users, type User, type InsertUser,
  waitlist, type Waitlist, type InsertWaitlist,
  calculations, type Calculation, type InsertCalculation
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
  
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getUserCalculations(userId: number): Promise<Calculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, Waitlist>;
  private calculations: Map<number, Calculation>;
  private userIdCounter: number;
  private waitlistIdCounter: number;
  private calculationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.calculations = new Map();
    this.userIdCounter = 1;
    this.waitlistIdCounter = 1;
    this.calculationIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addToWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistIdCounter++;
    const waitlistEntry: Waitlist = { ...entry, id };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email === email,
    );
  }

  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const id = this.calculationIdCounter++;
    const newCalculation: Calculation = { ...calculation, id };
    this.calculations.set(id, newCalculation);
    return newCalculation;
  }

  async getUserCalculations(userId: number): Promise<Calculation[]> {
    return Array.from(this.calculations.values()).filter(
      (calc) => calc.userId === userId,
    );
  }
}

export const storage = new MemStorage();
