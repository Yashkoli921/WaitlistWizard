import { create, all } from 'mathjs';

const math = create(all);

// Basic operations
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

export function percentage(value: number, percentage: number): number {
  return (value * percentage) / 100;
}

// Financial calculations
export function calculateMortgage(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  
  // Monthly payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  const totalPaid = monthlyPayment * totalPayments;
  const totalInterest = totalPaid - principal;
  
  return {
    monthlyPayment,
    totalInterest,
    totalPaid
  };
}

export function calculateInvestment(principal: number, monthlyContribution: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  
  let futureValue = principal;
  
  for (let i = 0; i < totalMonths; i++) {
    futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
  }
  
  const totalContributions = principal + (monthlyContribution * totalMonths);
  const totalInterest = futureValue - totalContributions;
  
  return {
    futureValue,
    totalContributions,
    totalInterest
  };
}

export function calculateROI(initialInvestment: number, finalValue: number): number {
  return ((finalValue - initialInvestment) / initialInvestment) * 100;
}

// Formatting functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(value);
}

// Scientific calculations
export function evaluateExpression(expression: string): number {
  try {
    return math.evaluate(expression);
  } catch (error) {
    throw new Error("Invalid expression");
  }
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

// Graphing functions
export function evaluateFunction(func: string, x: number, y: number): number {
  try {
    return math.evaluate(func, { x, y });
  } catch (error) {
    throw new Error("Error evaluating function");
  }
}

export function generateDataPoints(func: string, xMin: number, xMax: number, yMin: number, yMax: number, resolution: number) {
  const data = [];
  const xStep = (xMax - xMin) / resolution;
  const yStep = (yMax - yMin) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + (i * xStep);
      const y = yMin + (j * yStep);
      try {
        const z = evaluateFunction(func, x, y);
        if (!isNaN(z) && isFinite(z)) {
          data.push({ x, y, z });
        }
      } catch (error) {
        // Skip points where function cannot be evaluated
      }
    }
  }
  
  return data;
}
