import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export function QuickActionCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  variant = "primary",
  className 
}: QuickActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-hero border-brand-primary/20 text-primary-foreground hover:shadow-floating";
      case "secondary":
        return "bg-gradient-card border-border hover:shadow-widget";
      default:
        return "bg-gradient-card border-border hover:shadow-widget";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:-translate-y-1 cursor-pointer",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <Button 
          onClick={onClick}
          variant="ghost" 
          className="w-full h-auto p-0 flex flex-col items-center gap-3 text-inherit hover:bg-transparent"
        >
          <div className="text-3xl">{icon}</div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm opacity-80 mt-1">{description}</p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}