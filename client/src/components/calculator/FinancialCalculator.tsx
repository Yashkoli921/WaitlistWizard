import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { calculateMortgage, calculateInvestment, formatCurrency } from '@/lib/calculatorEngine';

type CalculatorType = 'mortgage' | 'investment' | 'loan' | 'roi';

const FinancialCalculator = () => {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('mortgage');
  const [loanAmount, setLoanAmount] = useState<string>('350000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [initialInvestment, setInitialInvestment] = useState<string>('10000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500');
  const [investmentYears, setInvestmentYears] = useState<string>('20');
  
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [totalInterest, setTotalInterest] = useState<string>('');
  const [futureValue, setFutureValue] = useState<string>('');
  const [totalContributions, setTotalContributions] = useState<string>('');
  
  const { toast } = useToast();

  const cleanNumberInput = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  const formatNumberInput = (value: string): string => {
    const cleaned = cleanNumberInput(value);
    if (!cleaned) return '';
    
    const num = parseFloat(cleaned);
    if (isNaN(num)) return '';
    
    return num.toLocaleString('en-US');
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setLoanAmount(value);
  };

  const calculateResults = () => {
    try {
      if (calculatorType === 'mortgage') {
        const amount = parseFloat(loanAmount.replace(/,/g, ''));
        const rate = parseFloat(interestRate);
        const years = parseFloat(loanTerm);
        
        if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
          throw new Error('Please enter valid numbers');
        }
        
        const result = calculateMortgage(amount, rate, years);
        setMonthlyPayment(formatCurrency(result.monthlyPayment));
        setTotalInterest(formatCurrency(result.totalInterest));
      } else if (calculatorType === 'investment') {
        const principal = parseFloat(initialInvestment.replace(/,/g, ''));
        const monthly = parseFloat(monthlyContribution.replace(/,/g, ''));
        const rate = parseFloat(interestRate);
        const years = parseFloat(investmentYears);
        
        if (isNaN(principal) || isNaN(monthly) || isNaN(rate) || isNaN(years)) {
          throw new Error('Please enter valid numbers');
        }
        
        const result = calculateInvestment(principal, monthly, rate, years);
        setFutureValue(formatCurrency(result.futureValue));
        setTotalContributions(formatCurrency(result.totalContributions));
      }
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    if (calculatorType === 'mortgage') {
      setLoanAmount('350000');
      setInterestRate('4.5');
      setLoanTerm('30');
      setMonthlyPayment('');
      setTotalInterest('');
    } else if (calculatorType === 'investment') {
      setInitialInvestment('10000');
      setMonthlyContribution('500');
      setInterestRate('7');
      setInvestmentYears('20');
      setFutureValue('');
      setTotalContributions('');
    }
  };

  return (
    <div className="calculator-3d">
      <div className="royal-gradient p-6 rounded-2xl shadow-calculator reflect-top">
        <div className="bg-navy-dark rounded-lg p-4 mb-4">
          <div className="font-playfair text-lg text-gold mb-3">
            {calculatorType === 'mortgage' ? 'Mortgage Calculator' : 'Investment Calculator'}
          </div>
          
          {/* Calculator Type Selector */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                className={`flex-1 ${calculatorType === 'mortgage' ? 'bg-gold text-dark hover:bg-gold-light' : 'text-gray-300 hover:text-gold'}`}
                onClick={() => setCalculatorType('mortgage')}
              >
                Mortgage
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 ${calculatorType === 'investment' ? 'bg-gold text-dark hover:bg-gold-light' : 'text-gray-300 hover:text-gold'}`}
                onClick={() => setCalculatorType('investment')}
              >
                Investment
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {calculatorType === 'mortgage' ? (
              <>
                {/* Loan Amount */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Loan Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      value={formatNumberInput(loanAmount)}
                      onChange={handleLoanAmountChange}
                      className="pl-8 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                  </div>
                </div>
                
                {/* Interest Rate */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Interest Rate</Label>
                  <div className="relative">
                    <Input
                      value={interestRate}
                      onChange={(e) => setInterestRate(cleanNumberInput(e.target.value))}
                      className="pr-8 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                
                {/* Loan Term */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Loan Term</Label>
                  <div className="relative">
                    <Input
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(cleanNumberInput(e.target.value))}
                      className="pr-12 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Years</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Initial Investment */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Initial Investment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      value={formatNumberInput(initialInvestment)}
                      onChange={(e) => setInitialInvestment(e.target.value.replace(/,/g, ''))}
                      className="pl-8 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                  </div>
                </div>
                
                {/* Monthly Contribution */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Monthly Contribution</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      value={formatNumberInput(monthlyContribution)}
                      onChange={(e) => setMonthlyContribution(e.target.value.replace(/,/g, ''))}
                      className="pl-8 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                  </div>
                </div>
                
                {/* Interest Rate */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Annual Return Rate</Label>
                  <div className="relative">
                    <Input
                      value={interestRate}
                      onChange={(e) => setInterestRate(cleanNumberInput(e.target.value))}
                      className="pr-8 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                
                {/* Investment Years */}
                <div>
                  <Label className="text-sm text-gray-400 block mb-1">Time Period</Label>
                  <div className="relative">
                    <Input
                      value={investmentYears}
                      onChange={(e) => setInvestmentYears(cleanNumberInput(e.target.value))}
                      className="pr-12 bg-navy border border-gray-700 text-gray-200 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Years</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-navy-dark rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {calculatorType === 'mortgage' ? (
              <>
                <div className="bg-navy p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Monthly Payment</div>
                  <div className="text-xl text-gold font-mono">{monthlyPayment || '$0.00'}</div>
                </div>
                <div className="bg-navy p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Interest</div>
                  <div className="text-xl text-gold font-mono">{totalInterest || '$0.00'}</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-navy p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Future Value</div>
                  <div className="text-xl text-gold font-mono">{futureValue || '$0.00'}</div>
                </div>
                <div className="bg-navy p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Contributions</div>
                  <div className="text-xl text-gold font-mono">{totalContributions || '$0.00'}</div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={resetForm}
            className="btn-calculator bg-navy-light hover:bg-navy text-gray-200"
          >
            Reset
          </Button>
          <Button 
            onClick={calculateResults}
            className="btn-gold text-dark font-bold"
          >
            Calculate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;
