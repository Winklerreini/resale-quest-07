import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/stores/useStore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Euro, TrendingUp, ShoppingBag, Users } from "lucide-react";

export default function Analytics() {
  const { sales, inventory, customers } = useStore();

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const avgProfitMargin = sales.length > 0 ? (totalProfit / sales.reduce((sum, sale) => sum + sale.purchasePrice, 0)) * 100 : 0;

  // Prepare monthly revenue data
  const monthlyData = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, profit: 0, sales: 0 };
    }
    acc[month].revenue += sale.salePrice;
    acc[month].profit += sale.profit;
    acc[month].sales += 1;
    return acc;
  }, {} as Record<string, { month: string; revenue: number; profit: number; sales: number }>);

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Platform performance data
  const platformData = sales.reduce((acc, sale) => {
    if (!acc[sale.platform]) {
      acc[sale.platform] = { platform: sale.platform, revenue: 0, count: 0 };
    }
    acc[sale.platform].revenue += sale.salePrice;
    acc[sale.platform].count += 1;
    return acc;
  }, {} as Record<string, { platform: string; revenue: number; count: number }>);

  const platformChartData = Object.values(platformData);

  const COLORS = ['hsl(var(--brand-primary))', 'hsl(var(--brand-secondary))', 'hsl(var(--status-active))', 'hsl(var(--status-pending))'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">€{totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">From {sales.length} sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit-positive">€{totalProfit.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">{avgProfitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-active">
              {inventory.filter(item => item.status === 'active' || item.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Available for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Total customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue & Profit</CardTitle>
            <CardDescription>Revenue and profit trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [`€${value.toFixed(0)}`, name === 'revenue' ? 'Revenue' : 'Profit']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--brand-primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--brand-primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="hsl(var(--profit-positive))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--profit-positive))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Revenue distribution by sales platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, revenue }) => `${platform}: €${revenue.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`€${value.toFixed(0)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Volume</CardTitle>
          <CardDescription>Number of items sold per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} sales`, 'Sales Count']} />
              <Bar 
                dataKey="sales" 
                fill="hsl(var(--brand-secondary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales.slice(-5).reverse().map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card">
                <div className="flex items-center gap-3">
                  {sale.image && (
                    <img 
                      src={sale.image} 
                      alt={sale.itemName}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{sale.itemName}</p>
                    <p className="text-sm text-muted-foreground">{sale.customer} • {sale.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{sale.salePrice}</p>
                  <p className="text-sm text-profit-positive">+€{sale.profit.toFixed(0)}</p>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sales recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}