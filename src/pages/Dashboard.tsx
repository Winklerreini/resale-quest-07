import { MetricCard } from "@/components/MetricCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { StatusBadge } from "@/components/StatusBadge";

import { AddOrder } from "@/components/forms/AddOrder";
import { RecordSale } from "@/components/forms/RecordSale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/stores/useStore";
import { 
  Package, 
  Euro, 
  TrendingUp, 
  ShoppingCart, 
  AlertCircle,
  Plus,
  BarChart3,
  Clock
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export default function Dashboard() {
  const { inventory, sales, orders } = useStore();

  // Calculate real metrics from store data
  const activeItems = inventory.filter(item => item.status === 'active').length;
  const soldItems = inventory.filter(item => item.status === 'sold').length;
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentPrice, 0);
  
  const monthlyRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const monthlyExpenses = orders.reduce((sum, order) => sum + order.totalCost, 0);
  const monthlyProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  
  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const getTimeSince = (date: string) => {
    const now = new Date();
    const saleDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-orange p-8 text-white shadow-orange-glow">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={dashboardHero} 
            alt="Dashboard Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-white/90 text-lg">
            Your resale business is growing strong. Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Inventory"
          value={inventory.length}
          subtitle={`${activeItems} active items`}
          variant="default"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`€${monthlyRevenue.toLocaleString()}`}
          subtitle="Total sales revenue"
          variant="revenue"
          icon={<Euro className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Profit"
          value={`€${monthlyProfit.toLocaleString()}`}
          subtitle="After all expenses"
          variant="profit"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Items Sold"
          value={soldItems}
          subtitle="This month"
          variant="default"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddOrder>
          <QuickActionCard
            title="Add New Order"
            description="Record a new purchase batch"
            icon={<ShoppingCart className="h-8 w-8" />}
            onClick={() => {}}
            variant="primary"
          />
        </AddOrder>
        <RecordSale>
          <QuickActionCard
            title="Record Sale"
            description="Log a completed sale"
            icon={<TrendingUp className="h-8 w-8" />}
            onClick={() => {}}
            variant="secondary"
          />
        </RecordSale>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-profit-positive" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card">
                  <div>
                    <p className="font-medium">{sale.itemName}</p>
                    <p className="text-sm text-muted-foreground">Sold to {sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-profit-positive">€{sale.salePrice}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeSince(sale.date)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sales recorded yet</p>
                  <RecordSale>
                    <Button variant="orange" className="mt-2">
                      Record Your First Sale
                    </Button>
                  </RecordSale>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Smart Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-status-pending" />
              Smart Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-status-pending/20 bg-status-pending/5">
                <p className="text-sm mb-3">Great job! Your business is growing steadily. Consider adding more inventory to meet demand.</p>
                <div className="flex gap-2">
                  <AddOrder>
                    <Button size="sm" variant="orange">
                      Add Items
                    </Button>
                  </AddOrder>
                  <Button size="sm" variant="ghost">
                    Learn More
                  </Button>
                </div>
              </div>
              
              {activeItems > 0 && (
                <div className="p-4 rounded-lg border border-status-active/20 bg-status-active/5">
                  <p className="text-sm mb-3">You have {activeItems} items ready to sell. Consider promoting them on social media!</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="success">
                      Share on Social
                    </Button>
                    <Button size="sm" variant="ghost">
                      View Items
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-profit-positive">{activeItems}</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-revenue">€{(totalInventoryValue / 1000).toFixed(1)}k</p>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-expense">€{monthlyExpenses.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-primary">
                {soldItems > 0 ? Math.round(monthlyProfit / soldItems) : 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg Profit/Item</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}