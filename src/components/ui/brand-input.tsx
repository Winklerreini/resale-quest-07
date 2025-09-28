import * as React from "react";
import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { ChevronDown } from "lucide-react";
import { getBrandSuggestions } from "@/utils/brands";
import { cn } from "@/lib/utils";

interface BrandInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function BrandInput({ value, onChange, placeholder = "Select or type brand...", className }: BrandInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  const suggestions = getBrandSuggestions(inputValue);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate text-left">
            {inputValue || placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search brands..."
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {suggestions.length > 0 ? (
              suggestions.map((brand) => (
                <CommandItem
                  key={brand}
                  value={brand}
                  onSelect={() => handleSelect(brand)}
                >
                  {brand}
                </CommandItem>
              ))
            ) : inputValue ? (
              <CommandItem
                value={inputValue}
                onSelect={() => handleSelect(inputValue)}
              >
                Use "{inputValue}"
              </CommandItem>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Start typing to see brand suggestions
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}