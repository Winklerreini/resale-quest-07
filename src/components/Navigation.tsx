import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  BarChart3,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: TrendingUp },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-orange text-white shadow-orange-glow">
        <div className="flex items-center justify-between p-4">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                        isActive
                        ? "bg-white/25 text-white shadow-card"
                        : "text-white/80 hover:bg-white/15 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-orange overflow-y-auto shadow-orange-glow">
          <div className="flex items-center flex-shrink-0 px-6 py-8">
            <Logo size="lg" />
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-smooth",
                    isActive
                      ? "bg-white/25 text-white shadow-widget"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  )
                }
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}