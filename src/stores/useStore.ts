import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  purchasePrice: number;
  currentPrice: number;
  status: 'active' | 'pending' | 'sold' | 'inactive' | 'shipping';
  location: string;
  image?: string;
  purchaseDate: string;
  orderId?: string;
  notes?: string;
  trackingNumber?: string;
}

export interface Order {
  id: string;
  name: string;
  date: string;
  totalCost: number;
  itemCount: number;
  status: 'completed' | 'processing' | 'pending';
  notes?: string;
  supplier?: string;
  trackingNumber?: string;
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  customer: string;
  platform: string;
  salePrice: number;
  purchasePrice: number;
  fees: number;
  profit: number;
  date: string;
  status: 'completed' | 'delivered' | 'shipped' | 'processing';
  image?: string;
  trackingNumber?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  platform: string;
  totalPurchases: number;
  lastPurchase: string;
  notes?: string;
}

interface StoreState {
  // Data
  inventory: InventoryItem[];
  orders: Order[];
  sales: Sale[];
  customers: Customer[];
  
  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Order actions
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // Sale actions
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Utility functions
  getItemsByOrder: (orderId: string) => InventoryItem[];
  getCustomerByName: (name: string) => Customer | undefined;
  markItemAsSold: (itemId: string, saleData: Omit<Sale, 'id' | 'itemId' | 'itemName' | 'purchasePrice' | 'profit' | 'image'>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      inventory: [],
      orders: [],
      sales: [],
      customers: [],
      
      // Inventory actions
      addInventoryItem: (item) => set((state) => ({
        inventory: [...state.inventory, { ...item, id: generateId() }]
      })),
      
      updateInventoryItem: (id, updates) => set((state) => ({
        inventory: state.inventory.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      deleteInventoryItem: (id) => set((state) => ({
        inventory: state.inventory.filter(item => item.id !== id)
      })),
      
      // Order actions
      addOrder: (order) => set((state) => ({
        orders: [...state.orders, { ...order, id: generateId() }]
      })),
      
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === id ? { ...order, ...updates } : order
        )
      })),
      
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      })),
      
      // Sale actions
      addSale: (sale) => set((state) => ({
        sales: [...state.sales, { ...sale, id: generateId() }]
      })),
      
      updateSale: (id, updates) => set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === id ? { ...sale, ...updates } : sale
        )
      })),
      
      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter(sale => sale.id !== id)
      })),
      
      // Customer actions
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: generateId() }]
      })),
      
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(customer => 
          customer.id === id ? { ...customer, ...updates } : customer
        )
      })),
      
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(customer => customer.id !== id)
      })),
      
      // Utility functions
      getItemsByOrder: (orderId) => {
        const state = get();
        return state.inventory.filter(item => item.orderId === orderId);
      },
      
      getCustomerByName: (name) => {
        const state = get();
        return state.customers.find(customer => customer.name.toLowerCase() === name.toLowerCase());
      },
      
      markItemAsSold: (itemId, saleData) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        if (!item) return;
        
        const profit = saleData.salePrice - item.purchasePrice - saleData.fees;
        
        // Add sale record
        const sale: Sale = {
          ...saleData,
          id: generateId(),
          itemId,
          itemName: item.name,
          purchasePrice: item.purchasePrice,
          profit,
          image: item.image
        };
        
        set((state) => ({
          inventory: state.inventory.map(i => 
            i.id === itemId ? { ...i, status: 'sold' as const } : i
          ),
          sales: [...state.sales, sale]
        }));
        
        // Add or update customer
        const existingCustomer = state.customers.find(c => c.name.toLowerCase() === saleData.customer.toLowerCase());
        if (existingCustomer) {
          state.updateCustomer(existingCustomer.id, {
            totalPurchases: existingCustomer.totalPurchases + 1,
            lastPurchase: saleData.date
          });
        } else {
          state.addCustomer({
            name: saleData.customer,
            platform: saleData.platform,
            totalPurchases: 1,
            lastPurchase: saleData.date
          });
        }
      }
    }),
    {
      name: 'resale-hub-storage',
      version: 1
    }
  )
);