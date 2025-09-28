import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores/useStore";

const saleSchema = z.object({
  itemId: z.string().min(1, "Please select an item"),
  customer: z.string().min(1, "Customer name is required"),
  platform: z.string().min(1, "Platform is required"),
  salePrice: z.coerce.number().min(0, "Sale price must be positive"),
  fees: z.coerce.number().min(0, "Fees cannot be negative"),
  date: z.string().min(1, "Date is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  trackingNumber: z.string().optional(),
});

interface RecordSaleProps {
  children: React.ReactNode;
  preselectedItemId?: string;
}

export function RecordSale({ children, preselectedItemId }: RecordSaleProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { inventory, markItemAsSold } = useStore();

  // Only show active and pending items
  const availableItems = inventory.filter(item => 
    item.status === 'active' || item.status === 'pending'
  );

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      itemId: preselectedItemId || "",
      customer: "",
      platform: "",
      salePrice: 0,
      fees: 0,
      date: new Date().toISOString().split('T')[0],
      customerEmail: "",
      customerPhone: "",
      trackingNumber: "",
    },
  });

  const watchedItemId = form.watch("itemId");
  const selectedItem = availableItems.find(item => item.id === watchedItemId);

  // Auto-calculate suggested price when item is selected
  useEffect(() => {
    if (selectedItem) {
      form.setValue("salePrice", selectedItem.currentPrice);
    }
  }, [selectedItem, form]);

  const onSubmit = (values: z.infer<typeof saleSchema>) => {
    if (!selectedItem) return;

    markItemAsSold(values.itemId, {
      customer: values.customer,
      platform: values.platform,
      salePrice: values.salePrice,
      fees: values.fees,
      date: values.date,
      status: "processing",
      customerEmail: values.customerEmail,
      customerPhone: values.customerPhone,
      trackingNumber: values.trackingNumber,
    });

    toast({
      title: "Sale recorded successfully",
      description: `${selectedItem.name} sold to ${values.customer} for €${values.salePrice}`,
    });

    form.reset({
      itemId: "",
      customer: "",
      platform: "",
      salePrice: 0,
      fees: 0,
      date: new Date().toISOString().split('T')[0],
      customerEmail: "",
      customerPhone: "",
      trackingNumber: "",
    });
    setOpen(false);
  };

  const platforms = [
    "Vinted", "eBay", "Instagram", "Facebook Marketplace", 
    "Depop", "Vestiaire Collective", "Private", "Other"
  ];

  const calculateProfit = () => {
    if (!selectedItem) return 0;
    const salePrice = form.watch("salePrice") || 0;
    const fees = form.watch("fees") || 0;
    return salePrice - selectedItem.purchasePrice - fees;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose item to sell" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - {item.brand} (€{item.currentPrice})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedItem && (
              <div className="p-4 bg-gradient-card rounded-lg border">
                <div className="flex items-center gap-4">
                  {selectedItem.image && (
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.brand} • Size {selectedItem.size}
                    </p>
                    <p className="text-sm">
                      Purchase Price: €{selectedItem.purchasePrice} • 
                      Listed: €{selectedItem.currentPrice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah Miller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="85.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Fees (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="8.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="customer@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="TR123456789DE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedItem && (
              <div className="p-4 bg-profit-positive/10 border border-profit-positive/20 rounded-lg">
                <h4 className="font-medium text-profit-positive mb-2">Profit Calculation</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sale Price:</span>
                    <span>€{form.watch("salePrice") || 0}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Purchase Price:</span>
                    <span>-€{selectedItem.purchasePrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Fees:</span>
                    <span>-€{form.watch("fees") || 0}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-semibold text-profit-positive">
                    <span>Net Profit:</span>
                    <span>€{calculateProfit().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1">
                Record Sale
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}