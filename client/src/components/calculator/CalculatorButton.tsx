import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  type?: 'number' | 'operator' | 'function' | 'equals' | 'clear';
  className?: string;
  width?: 'normal' | 'double';
}

const CalculatorButton = ({
  value,
  onClick,
  type = 'number',
  className = '',
  width = 'normal',
}: CalculatorButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => isPressed && setIsPressed(false);

  const buttonClasses = cn(
    'btn-calculator p-3 md:p-4 rounded-lg font-semibold transition-all transform',
    {
      'bg-navy-light hover:bg-navy text-gray-200': type === 'number' || type === 'function',
      'bg-gold hover:bg-gold-light text-dark': type === 'operator' || type === 'equals',
      'bg-navy-dark hover:bg-navy text-gray-200': type === 'clear',
      'col-span-2': width === 'double',
      'translate-y-1': isPressed,
      'hover:-translate-y-1': !isPressed,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={() => onClick(value)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {value}
    </button>
  );
};

export default CalculatorButton;
