import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  currency?: string;
  className?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, step = 1, min = 0, max, currency = "€", className, ...props }, ref) => {
    const handleIncrement = () => {
      const newValue = value + step;
      if (max === undefined || newValue <= max) {
        onChange(newValue);
      }
    };

    const handleDecrement = () => {
      const newValue = value - step;
      if (newValue >= min) {
        onChange(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value) || 0;
      if (newValue >= min && (max === undefined || newValue <= max)) {
        onChange(newValue);
      }
    };

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-9 w-9 shrink-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="number"
            value={value}
            onChange={handleInputChange}
            step={step}
            min={min}
            max={max}
            className="text-center pr-8"
            {...props}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {currency}
          </span>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          className="h-9 w-9 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";