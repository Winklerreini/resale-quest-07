import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useStore } from "@/stores/useStore";
import { toast } from "sonner";

const addCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  platform: z.string().min(1, "Platform is required"),
  notes: z.string().optional(),
  image: z.string().optional(),
});

type AddCustomerFormData = z.infer<typeof addCustomerSchema>;

interface AddCustomerProps {
  children: React.ReactNode;
}

export function AddCustomer({ children }: AddCustomerProps) {
  const [open, setOpen] = useState(false);
  const { addCustomer } = useStore();
  const [customerImage, setCustomerImage] = useState<string>("");

  const form = useForm<AddCustomerFormData>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      platform: "",
      notes: "",
      image: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomerImage(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCustomerImage("");
    form.setValue('image', "");
  };

  const onSubmit = (data: AddCustomerFormData) => {
    addCustomer({
      name: data.name,
      platform: data.platform,
      email: data.email || undefined,
      phone: data.phone || undefined,
      notes: data.notes || undefined,
      image: data.image || undefined,
      totalPurchases: 0,
      lastPurchase: new Date().toISOString(),
    });
    
    toast.success("Customer added successfully!");
    form.reset();
    setCustomerImage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to your database.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+49 123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input placeholder="eBay, Instagram, etc." {...field} />
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
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes about this customer..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Image (optional)</label>
              {customerImage ? (
                <div className="relative inline-block">
                  <img 
                    src={customerImage} 
                    alt="Customer preview" 
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <label htmlFor="customer-image" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    <input
                      id="customer-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Add Customer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}