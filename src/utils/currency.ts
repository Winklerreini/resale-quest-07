import { Currency } from "@/stores/useSettingsStore";

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbols = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF'
  };

  const formatters = {
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    CHF: new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' })
  };

  return formatters[currency].format(amount);
};

export const getCurrencySymbol = (currency: Currency): string => {
  const symbols = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF'
  };
  
  return symbols[currency];
};