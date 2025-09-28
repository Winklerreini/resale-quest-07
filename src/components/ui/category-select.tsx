import * as React from "react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { Input } from "./input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Plus } from "lucide-react";
import { getCategoriesWithCustom, addCustomCategory } from "@/utils/categories";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  customCategories?: string[];
  onAddCustomCategory?: (category: string) => void;
  placeholder?: string;
}

export function CategorySelect({ 
  value, 
  onChange, 
  customCategories = [], 
  onAddCustomCategory,
  placeholder = "Select category" 
}: CategorySelectProps) {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customInput, setCustomInput] = useState("");
  
  const categories = getCategoriesWithCustom(customCategories);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "Others (Custom)") {
      setShowCustomDialog(true);
    } else {
      onChange(selectedValue);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && onAddCustomCategory) {
      onAddCustomCategory(trimmed);
      onChange(trimmed);
    }
    setCustomInput("");
    setShowCustomDialog(false);
  };

  return (
    <>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              <div className="flex items-center gap-2">
                {category === "Others (Custom)" && (
                  <Plus className="h-4 w-4 text-brand-primary" />
                )}
                {category}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter category name..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustom} disabled={!customInput.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}