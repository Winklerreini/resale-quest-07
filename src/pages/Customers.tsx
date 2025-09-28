import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/stores/useStore";
import { 
  Users, 
  Search, 
  Euro, 
  Calendar,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  Edit3
} from "lucide-react";
import { EditCustomer } from "@/components/forms/EditCustomer";

export default function Customers() {
  const { customers, sales, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCustomerSales = (customerId: string) => {
    return sales.filter(sale => 
      sale.customer.toLowerCase() === customers.find(c => c.id === customerId)?.name.toLowerCase()
    );
  };

  const getTotalSpent = (customerId: string) => {
    return getCustomerSales(customerId).reduce((sum, sale) => sum + sale.salePrice, 0);
  };

  const getAverageOrderValue = (customerId: string) => {
    const customerSales = getCustomerSales(customerId);
    return customerSales.length > 0 ? getTotalSpent(customerId) / customerSales.length : 0;
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships and track purchases</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-primary">{customers.length}</p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-revenue">
              €{customers.reduce((sum, customer) => sum + getTotalSpent(customer.id), 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-active">
              {customers.length > 0 ? Math.round(customers.reduce((sum, customer) => sum + getTotalSpent(customer.id), 0) / customers.length) : 0}
            </p>
            <p className="text-sm text-muted-foreground">Avg Customer Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-profit-positive">
              {customers.filter(customer => getTotalSpent(customer.id) > 100).length}
            </p>
            <p className="text-sm text-muted-foreground">High Value (€100+)</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Customers</h2>
          <div className="space-y-4">
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <Card 
                key={customer.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-widget hover:-translate-y-1 ${
                  selectedCustomer?.id === customer.id ? 'ring-2 ring-brand-primary shadow-widget' : ''
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-orange rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        {customer.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {customer.platform}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Purchases</p>
                      <p className="font-medium">{getCustomerSales(customer.id).length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Spent</p>
                      <p className="font-medium text-revenue">€{getTotalSpent(customer.id)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Purchase</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(customer.lastPurchase).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <EditCustomer customer={customer}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 flex-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        Bearbeiten
                      </Button>
                    </EditCustomer>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomer(customer.id);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No customers found</p>
                  <p className="text-sm text-muted-foreground">
                    Customers are automatically added when you record sales.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-orange rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span>{selectedCustomer.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {selectedCustomer.platform}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-card rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                    <p className="font-medium">{getCustomerSales(selectedCustomer.id).length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-medium text-revenue">€{getTotalSpent(selectedCustomer.id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Order</p>
                    <p className="font-medium">€{Math.round(getAverageOrderValue(selectedCustomer.id))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Purchase</p>
                    <p className="font-medium">{new Date(selectedCustomer.lastPurchase).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedCustomer.email && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedCustomer.email}
                    </p>
                  </div>
                )}

                {selectedCustomer.phone && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedCustomer.phone}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">Purchase History</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getCustomerSales(selectedCustomer.id).length > 0 ? (
                      getCustomerSales(selectedCustomer.id).map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{sale.itemName}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(sale.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-revenue">€{sale.salePrice}</p>
                            <p className="text-xs text-muted-foreground">{sale.platform}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No purchase history available
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <EditCustomer customer={selectedCustomer}>
                    <Button variant="outline" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Kunde bearbeiten
                    </Button>
                  </EditCustomer>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Kunde löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a customer to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}