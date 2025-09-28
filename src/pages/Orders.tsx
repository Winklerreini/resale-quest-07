import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { AddOrder } from "@/components/forms/AddOrder";
import { useStore } from "@/stores/useStore";
import { 
  Plus, 
  Package, 
  Calendar,
  Euro,
  ShoppingBag,
  MapPin,
  Trash2
} from "lucide-react";

export default function Orders() {
  const { orders, inventory, getItemsByOrder, deleteOrder } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-status-active text-white";
      case "processing":
        return "bg-status-pending text-white";
      case "pending":
        return "bg-status-inactive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTotalValue = () => {
    return orders.reduce((sum, order) => sum + order.totalCost, 0);
  };

  const getTotalItems = () => {
    return orders.reduce((sum, order) => sum + order.itemCount, 0);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(id);
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Track your buying history and manage inventory sectors</p>
        </div>
        <AddOrder>
          <Button variant="orange" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </AddOrder>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-primary">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-expense">€{getTotalValue().toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Invested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-active">{getTotalItems()}</p>
            <p className="text-sm text-muted-foreground">Items Purchased</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-revenue">
              €{Math.round(getTotalValue() / getTotalItems())}
            </p>
            <p className="text-sm text-muted-foreground">Avg Cost/Item</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          {orders.length > 0 ? orders.map((order) => (
            <Card 
              key={order.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-widget hover:-translate-y-1 ${
                selectedOrder?.id === order.id ? 'ring-2 ring-brand-primary shadow-widget' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-expense" />
                    <span className="font-medium">€{order.totalCost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-brand-primary" />
                    <span>{order.itemCount} items</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOrder(order.id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No orders yet</p>
                <AddOrder>
                  <Button variant="brand">Add Your First Order</Button>
                </AddOrder>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedOrder.name}</span>
                  <Badge className={getOrderStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-card rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="font-medium text-expense">€{selectedOrder.totalCost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Item Count</p>
                    <p className="font-medium">{selectedOrder.itemCount} pieces</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Cost/Item</p>
                    <p className="font-medium">€{Math.round(selectedOrder.totalCost / selectedOrder.itemCount)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Items in this order</h4>
                  <div className="space-y-2">
                    {getItemsByOrder(selectedOrder.id).length > 0 ? (
                      getItemsByOrder(selectedOrder.id).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">€{item.purchasePrice}</p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No items assigned to this order yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                  >
                    Delete Order
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select an order to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}