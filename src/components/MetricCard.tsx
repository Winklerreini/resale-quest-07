import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "profit" | "revenue" | "expense";
  className?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  variant = "default",
  className,
  icon 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "profit":
        return "border-profit-positive/20 bg-gradient-to-br from-card to-profit-positive/5";
      case "revenue":
        return "border-revenue/20 bg-gradient-to-br from-card to-revenue/5";
      case "expense":
        return "border-expense/20 bg-gradient-to-br from-card to-expense/5";
      default:
        return "border-border bg-gradient-card";
    }
  };

  const getTrendStyles = () => {
    switch (trend) {
      case "up":
        return "text-profit-positive";
      case "down":
        return "text-profit-negative";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-widget hover:-translate-y-1",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              getTrendStyles()
            )}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}