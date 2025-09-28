import * as React from "react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { Input } from "./input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Badge } from "./badge";
import { Plus, Ruler } from "lucide-react";
import { getSizeSuggestionsForCategory, SizeCategory } from "@/utils/sizes";

interface SizeSelectProps {
  value: string;
  onChange: (value: string) => void;
  category?: string;
  placeholder?: string;
  className?: string;
}

export function SizeSelect({ 
  value, 
  onChange, 
  category = "",
  placeholder = "Größe auswählen",
  className = ""
}: SizeSelectProps) {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<SizeCategory | null>(null);
  
  const sizeSuggestions = React.useMemo(() => {
    return category ? getSizeSuggestionsForCategory(category) : [];
  }, [category]);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "custom-size") {
      setShowCustomDialog(true);
    } else {
      onChange(selectedValue);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed) {
      onChange(trimmed);
    }
    setCustomInput("");
    setShowCustomDialog(false);
  };

  const renderSizeOptions = () => {
    const options: React.ReactNode[] = [];
    
    // Größenvorschläge basierend auf Kategorie
    sizeSuggestions.forEach((sizeCategory, categoryIndex) => {
      // Kategorie-Header
      options.push(
        <div key={`header-${categoryIndex}`} className="px-3 py-2 text-xs font-semibold text-brand-primary bg-accent/30 border-b border-border">
          {sizeCategory.label}
        </div>
      );
      
      // Größen in dieser Kategorie
      sizeCategory.sizes.forEach((size) => {
        options.push(
          <SelectItem key={size} value={size} className="pl-6 hover:bg-accent/50 focus:bg-accent">
            <div className="flex items-center gap-2">
              <Ruler className="h-3 w-3 text-brand-primary" />
              <span className="font-medium">{size}</span>
            </div>
          </SelectItem>
        );
      });
    });

    // Custom-Option hinzufügen
    if (sizeSuggestions.length > 0) {
      options.push(
        <div key="custom-divider" className="border-t my-1" />
      );
    }
    
    options.push(
      <SelectItem key="custom-size" value="custom-size" className="font-medium hover:bg-brand-primary/10 focus:bg-brand-primary/10">
        <div className="flex items-center gap-2">
          <Plus className="h-3 w-3 text-brand-primary" />
          <span className="text-brand-primary">Eigene Größe eingeben</span>
        </div>
      </SelectItem>
    );

    return options;
  };

  return (
    <>
      <div className={className}>
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-80 bg-card border-border">
            {category && sizeSuggestions.length > 0 ? (
              renderSizeOptions()
            ) : (
              <>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
                <SelectItem value="custom-size">
                  <div className="flex items-center gap-2">
                    <Plus className="h-3 w-3 text-brand-primary" />
                    Eigene Größe eingeben
                  </div>
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        
        {category && sizeSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {sizeSuggestions.map((sizeCategory) => (
              <Badge 
                key={sizeCategory.label} 
                variant="outline" 
                className="text-xs bg-brand-primary/10 border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20"
              >
                {sizeCategory.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eigene Größe eingeben</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="z.B. 42.5, L/XL, 32/34..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddCustom} disabled={!customInput.trim()}>
              Größe hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}