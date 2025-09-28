import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "pending" | "sold" | "inactive" | "shipping";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-status-active text-white hover:bg-status-active/90";
      case "pending":
        return "bg-status-pending text-white hover:bg-status-pending/90";
      case "sold":
        return "bg-status-sold text-white hover:bg-status-sold/90";
      case "inactive":
        return "bg-status-inactive text-white hover:bg-status-inactive/90";
      case "shipping":
        return "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "In Stock";
      case "pending":
        return "Listed";
      case "sold":
        return "Sold";
      case "inactive":
        return "Inactive";
      case "shipping":
        return "Shipping";
      default:
        return status;
    }
  };

  return (
    <Badge className={cn(getStatusStyles(), className)}>
      {getStatusText()}
    </Badge>
  );
}