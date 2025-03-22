import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCalculator } from '@/lib/calculator';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface FinancialInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const FinancialInput = ({ label, value, onChange, prefix, suffix, className }: FinancialInputProps) => {
  return (
    <div className={className}>
      <Label htmlFor={label.toLowerCase()} className="text-gold text-xs mb-1">{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gold">
            {prefix}
          </span>
        )}
        <Input
          id={label.toLowerCase()}
          value={value}
          onChange={onChange}
          className={`bg-darkBg border border-gold/20 text-white ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gold">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

const FinancialCalculator = () => {
  const { calculateFinancial, history, exportToCSV } = useCalculator();
  const [calculationType, setCalculationType] = useState<'loan' | 'investment' | 'roi' | 'mortgage'>('loan');
  const [result, setResult] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // Loan/Mortgage state
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('5');
  
  // Investment state
  const [investmentAmount, setInvestmentAmount] = useState('10000');
  const [annualReturn, setAnnualReturn] = useState('8');
  const [investmentTerm, setInvestmentTerm] = useState('10');
  
  // ROI state
  const [initialCost, setInitialCost] = useState('5000');
  const [finalValue, setFinalValue] = useState('8000');
  
  const handleCalculate = async () => {
    try {
      let calculationResult;
      
      switch (calculationType) {
        case 'loan':
        case 'mortgage':
          calculationResult = await calculateFinancial('loan', {
            principal: parseFloat(loanAmount),
            rate: parseFloat(interestRate),
            term: parseFloat(loanTerm)
          });
          break;
          
        case 'investment':
          calculationResult = await calculateFinancial('investment', {
            principal: parseFloat(investmentAmount),
            rate: parseFloat(annualReturn),
            term: parseFloat(investmentTerm)
          });
          break;
          
        case 'roi':
          calculationResult = await calculateFinancial('roi', {
            cost: parseFloat(initialCost),
            gain: parseFloat(finalValue)
          });
          break;
      }
      
      setResult(calculationResult);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };
  
  const renderResult = () => {
    if (result === null) return null;
    
    switch (calculationType) {
      case 'loan':
      case 'mortgage':
        return (
          <div className="mt-4 p-4 bg-navy/40 border border-gold/30 rounded-md">
            <p className="font-mono text-lg text-gold">
              Monthly Payment: {formatCurrency(result)}
            </p>
            <p className="text-sm text-lightGray mt-2">
              Total Cost: {formatCurrency(result * parseFloat(loanTerm) * 12)}
            </p>
          </div>
        );
        
      case 'investment':
        return (
          <div className="mt-4 p-4 bg-navy/40 border border-gold/30 rounded-md">
            <p className="font-mono text-lg text-gold">
              Future Value: {formatCurrency(result)}
            </p>
            <p className="text-sm text-lightGray mt-2">
              Total Growth: {formatCurrency(result - parseFloat(investmentAmount))}
            </p>
          </div>
        );
        
      case 'roi':
        return (
          <div className="mt-4 p-4 bg-navy/40 border border-gold/30 rounded-md">
            <p className="font-mono text-lg text-gold">
              ROI: {formatPercentage(result)}
            </p>
            <p className="text-sm text-lightGray mt-2">
              Profit: {formatCurrency(parseFloat(finalValue) - parseFloat(initialCost))}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="calculator-3d perspective-1000">
      <motion.div
        initial={{ rotateX: 20, rotateY: -10 }}
        animate={{ rotateX: 5, rotateY: 10 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="transform-style-3d"
      >
        <Card className="relative bg-darkCard border border-gold/30 p-6 shadow-lg overflow-hidden">
          <div className="card-shine absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-playfair text-2xl font-bold text-gold">Financial Calculator</h3>
            <div className="flex gap-2">
              <Button 
                variant="royal-outline" 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
              <Button 
                variant="royal-outline" 
                size="sm" 
                onClick={exportToCSV}
                className="text-xs"
              >
                Export
              </Button>
            </div>
          </div>
          
          {/* Result Display */}
          <div className="mb-4 p-4 bg-navy border border-gold/30 rounded-md h-14 flex items-center justify-end">
            <motion.p 
              key={result}
              initial={{ opacity: 0.8, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-right text-xl text-gold calculator-display overflow-x-auto whitespace-nowrap"
            >
              {result !== null 
                ? calculationType === 'roi' 
                  ? `ROI: ${formatPercentage(result)}` 
                  : formatCurrency(result)
                : 'Enter values and calculate'}
            </motion.p>
          </div>
          
          {showHistory && (
            <div className="mb-4 max-h-32 overflow-auto bg-navy/30 border border-gold/20 rounded-md p-2">
              <ul className="text-sm">
                {history.filter(item => item.expression.includes('financial')).map((item, index) => (
                  <li key={index} className="mb-1 font-mono text-lightGray">
                    <span className="text-gold">{item.expression.substring(0, 25)}...</span> = {item.result}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Tabs value={calculationType} onValueChange={(value) => setCalculationType(value as any)}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="loan">Loan</TabsTrigger>
              <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
              <TabsTrigger value="roi">ROI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="loan">
              <div className="space-y-3">
                <FinancialInput 
                  label="Loan Amount" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value)} 
                  prefix="$" 
                />
                <FinancialInput 
                  label="Interest Rate" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)} 
                  suffix="%" 
                />
                <FinancialInput 
                  label="Term (Years)" 
                  value={loanTerm} 
                  onChange={(e) => setLoanTerm(e.target.value)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="mortgage">
              <div className="space-y-3">
                <FinancialInput 
                  label="Mortgage Amount" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value)} 
                  prefix="$" 
                />
                <FinancialInput 
                  label="Interest Rate" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)} 
                  suffix="%" 
                />
                <FinancialInput 
                  label="Term (Years)" 
                  value={loanTerm} 
                  onChange={(e) => setLoanTerm(e.target.value)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="investment">
              <div className="space-y-3">
                <FinancialInput 
                  label="Initial Investment" 
                  value={investmentAmount} 
                  onChange={(e) => setInvestmentAmount(e.target.value)} 
                  prefix="$" 
                />
                <FinancialInput 
                  label="Annual Return" 
                  value={annualReturn} 
                  onChange={(e) => setAnnualReturn(e.target.value)} 
                  suffix="%" 
                />
                <FinancialInput 
                  label="Time Period (Years)" 
                  value={investmentTerm} 
                  onChange={(e) => setInvestmentTerm(e.target.value)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="roi">
              <div className="space-y-3">
                <FinancialInput 
                  label="Initial Cost" 
                  value={initialCost} 
                  onChange={(e) => setInitialCost(e.target.value)} 
                  prefix="$" 
                />
                <FinancialInput 
                  label="Final Value" 
                  value={finalValue} 
                  onChange={(e) => setFinalValue(e.target.value)} 
                  prefix="$" 
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {renderResult()}
          
          <Button 
            variant="gold-gradient" 
            className="w-full mt-4"
            onClick={handleCalculate}
          >
            Calculate
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default FinancialCalculator;
