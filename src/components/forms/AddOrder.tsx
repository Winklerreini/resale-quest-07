import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { BrandInput } from "@/components/ui/brand-input";
import { CategorySelect } from "@/components/ui/category-select";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores/useStore";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  brand: z.string().min(1, "Brand is required"),
  size: z.string().min(1, "Size is required"),
  category: z.string().min(1, "Category is required"),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be positive"),
  currentPrice: z.coerce.number().min(0, "Current price must be positive"),
  location: z.string().min(1, "Storage location is required"),
  image: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

const orderSchema = z.object({
  name: z.string().min(1, "Order name is required"),
  date: z.string().min(1, "Date is required"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

interface AddOrderProps {
  children: React.ReactNode;
}

export function AddOrder({ children }: AddOrderProps) {
  const [open, setOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const { addOrder, addInventoryItem } = useStore();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      supplier: "",
      notes: "",
      items: [
        {
          name: "",
          brand: "",
          size: "",
          category: "",
          purchasePrice: 0,
          currentPrice: 0,
          location: "",
          image: "",
          notes: "",
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (values: z.infer<typeof orderSchema>) => {
    const totalCost = values.items.reduce((sum, item) => sum + item.purchasePrice, 0);
    
    const newOrder = {
      name: values.name,
      date: values.date,
      totalCost,
      itemCount: values.items.length,
      supplier: values.supplier || undefined,
      notes: values.notes || undefined,
      status: "processing" as const,
    };
    
    addOrder(newOrder);

    // Add each item to inventory with the order ID
    const orderId = Math.random().toString(36).substr(2, 9);
    values.items.forEach(item => {
      addInventoryItem({
        name: item.name,
        brand: item.brand,
        size: item.size,
        category: item.category,
        purchasePrice: item.purchasePrice,
        currentPrice: item.currentPrice,
        location: item.location,
        orderId,
        status: "active" as const,
        purchaseDate: values.date,
        image: item.image || undefined,
        notes: item.notes || undefined,
      });
    });

    toast({
      title: "Order and items added successfully",
      description: `${values.name} with ${values.items.length} items has been created.`,
    });

    form.reset({
      name: "",
      date: new Date().toISOString().split('T')[0],
      supplier: "",
      notes: "",
      items: [
        {
          name: "",
          brand: "",
          size: "",
          category: "",
          purchasePrice: 0,
          currentPrice: 0,
          location: "",
          image: "",
          notes: "",
        }
      ],
    });
    setOpen(false);
  };

  const handleAddCustomCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Vintage Store Haul #2" {...field} />
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
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Local Vintage Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Bulk purchase details, special conditions, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items in Order</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({
                    name: "",
                    brand: "",
                    size: "",
                    category: "",
                    purchasePrice: 0,
                    currentPrice: 0,
                    location: "",
                    image: "",
                    notes: "",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Item {index + 1}</CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Nike Air Max 90" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.brand`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <BrandInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select or type brand..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <CategorySelect
                                value={field.value}
                                onChange={field.onChange}
                                customCategories={customCategories}
                                onAddCustomCategory={handleAddCustomCategory}
                                placeholder="Select category"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.size`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input placeholder="42, L, 32/34" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.purchasePrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price (€)</FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onChange={field.onChange}
                                step={1}
                                min={0}
                                currency="€"
                                placeholder="45.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.currentPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current/List Price (€)</FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onChange={field.onChange}
                                step={1}
                                min={0}
                                currency="€"
                                placeholder="85.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.location`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Location</FormLabel>
                            <FormControl>
                              <Input placeholder="A1-03, Box 5, Shelf B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.image`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/image.jpg" 
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
                      name={`items.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Condition notes, special features, etc." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="hero" className="flex-1">
                Create Order
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