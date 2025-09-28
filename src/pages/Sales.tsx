import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecordSale } from "@/components/forms/RecordSale";
import { useStore } from "@/stores/useStore";
import { 
  TrendingUp,
  Euro,
  Users,
  Package,
  Calendar,
  ExternalLink,
  Plus,
  Trash2
} from "lucide-react";

const platforms = ["All", "Vinted", "eBay", "Instagram", "Private", "Depop"];

export default function Sales() {
  const { sales, deleteSale } = useStore();
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedSale, setSelectedSale] = useState<typeof sales[0] | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-status-active text-white";
      case "shipped":
        return "bg-status-pending text-white";
      case "processing":
        return "bg-status-inactive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Vinted":
        return "bg-green-500 text-white";
      case "eBay":
        return "bg-blue-500 text-white";
      case "Instagram":
        return "bg-pink-500 text-white";
      case "Private":
        return "bg-purple-500 text-white";
      case "Depop":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredSales = selectedPlatform === "All" 
    ? sales 
    : sales.filter(sale => sale.platform === selectedPlatform);

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.salePrice, 0);
  };

  const getTotalProfit = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
  };

  const getAverageProfit = () => {
    return filteredSales.length > 0 ? getTotalProfit() / filteredSales.length : 0;
  };

  const getProfitMargin = (sale: typeof sales[0]) => {
    return ((sale.profit / sale.salePrice) * 100).toFixed(1);
  };

  const handleDeleteSale = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      deleteSale(id);
      if (selectedSale?.id === id) {
        setSelectedSale(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track your completed sales and analyze performance</p>
        </div>
        <RecordSale>
          <Button variant="orange" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Record Sale
          </Button>
        </RecordSale>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-revenue">€{getTotalRevenue().toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-profit-positive">€{getTotalProfit().toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-primary">{filteredSales.length}</p>
            <p className="text-sm text-muted-foreground">Sales Count</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-active">€{Math.round(getAverageProfit())}</p>
            <p className="text-sm text-muted-foreground">Avg Profit</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "brand" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
              >
                {platform}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Sales</h2>
          <div className="space-y-4">
            {filteredSales.length > 0 ? filteredSales.map((sale) => (
              <Card 
                key={sale.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-widget hover:-translate-y-1 ${
                  selectedSale?.id === sale.id ? 'ring-2 ring-brand-primary shadow-widget' : ''
                }`}
                onClick={() => setSelectedSale(sale)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {sale.image && (
                      <img
                        src={sale.image}
                        alt={sale.itemName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold truncate">{sale.itemName}</h3>
                          <p className="text-sm text-muted-foreground">Sold to {sale.customer}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <Badge className={getStatusColor(sale.status)}>
                            {sale.status}
                          </Badge>
                          <Badge className={getPlatformColor(sale.platform)}>
                            {sale.platform}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sale Price</p>
                          <p className="font-medium">€{sale.salePrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Profit</p>
                          <p className="font-medium text-profit-positive">€{sale.profit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Margin</p>
                          <p className="font-medium">{getProfitMargin(sale)}%</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSale(sale.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No sales recorded yet</p>
                  <RecordSale>
                    <Button variant="brand">Record Your First Sale</Button>
                  </RecordSale>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sale Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sale Details</h2>
          {selectedSale ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedSale.itemName}</span>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedSale.status)}>
                      {selectedSale.status}
                    </Badge>
                    <Badge className={getPlatformColor(selectedSale.platform)}>
                      {selectedSale.platform}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedSale.image && (
                  <div className="flex justify-center">
                    <img
                      src={selectedSale.image}
                      alt={selectedSale.itemName}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-card rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedSale.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="font-medium">{selectedSale.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sale Date</p>
                    <p className="font-medium">{new Date(selectedSale.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedSale.status}</p>
                  </div>
                </div>

                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Financial Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sale Price:</span>
                      <span className="font-medium">€{selectedSale.salePrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Purchase Price:</span>
                      <span>-€{selectedSale.purchasePrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fees:</span>
                      <span>-€{selectedSale.fees}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Net Profit:</span>
                      <span className="text-profit-positive">€{selectedSale.profit}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Profit Margin: {getProfitMargin(selectedSale)}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDeleteSale(selectedSale.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Sale
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on {selectedSale.platform}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a sale to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}