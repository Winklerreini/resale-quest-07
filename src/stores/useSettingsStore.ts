import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

interface SettingsState {
  theme: Theme;
  currency: Currency;
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      currency: 'EUR',
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'resale-hub-settings',
      version: 1
    }
  )
);