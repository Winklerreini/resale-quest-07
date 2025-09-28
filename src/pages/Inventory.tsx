import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { AddOrder } from "@/components/forms/AddOrder";
import { RecordSale } from "@/components/forms/RecordSale";
import { EditInventoryItem } from "@/components/forms/EditInventoryItem";
import { useStore } from "@/stores/useStore";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  Euro,
  MapPin,
  Edit,
  Trash2,
  Package
} from "lucide-react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { inventory, deleteInventoryItem } = useStore();

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getProfit = (item: typeof inventory[0]) => {
    return item.currentPrice - item.purchasePrice;
  };

  const getProfitMargin = (item: typeof inventory[0]) => {
    return ((getProfit(item) / item.purchasePrice) * 100).toFixed(1);
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your clothing items and track performance</p>
        </div>
        <AddOrder>
          <Button variant="orange" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Items via Order
          </Button>
        </AddOrder>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Listed</option>
            <option value="sold">Sold</option>
            <option value="inactive">Inactive</option>
            <option value="shipping">Shipping</option>
          </select>
          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-primary">{filteredItems.length}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-active">
              {filteredItems.filter(item => item.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-pending">
              {filteredItems.filter(item => item.status === "pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-profit-positive">
              €{filteredItems.reduce((sum, item) => sum + getProfit(item), 0).toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Profit</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-widget transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.brand} • Size {item.size}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Purchase:</span>
                      <span>€{item.purchasePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium">€{item.currentPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Profit:</span>
                      <span className="font-medium text-profit-positive">
                        €{getProfit(item)} ({getProfitMargin(item)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    {(item.status === 'active' || item.status === 'pending') && (
                      <RecordSale preselectedItemId={item.id}>
                        <Button size="sm" variant="success" className="flex-1">
                          Sell
                        </Button>
                      </RecordSale>
                    )}
                    <EditInventoryItem item={item}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </EditInventoryItem>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No items found</p>
                <p className="text-sm">Try adjusting your search or add new inventory items.</p>
                <AddOrder>
                  <Button variant="orange" className="mt-4">
                    Create Your First Order
                  </Button>
                </AddOrder>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gradient-card transition-colors">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.brand} • Size {item.size} • {item.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{item.currentPrice}</p>
                      <p className="text-sm text-profit-positive">
                        +€{getProfit(item)} ({getProfitMargin(item)}%)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(item.status === 'active' || item.status === 'pending') && (
                        <RecordSale preselectedItemId={item.id}>
                          <Button size="sm" variant="success">
                            Sell
                          </Button>
                        </RecordSale>
                      )}
                      <EditInventoryItem item={item}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditInventoryItem>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No items found</p>
                  <p className="text-sm">Try adjusting your search or add new inventory items.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}