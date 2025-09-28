import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore, Theme, Currency } from "@/stores/useSettingsStore";
import { useEffect } from "react";

const themeOptions = [
  { value: 'light' as Theme, label: 'Light Mode' },
  { value: 'dark' as Theme, label: 'Dark Mode' },
  { value: 'system' as Theme, label: 'System (Orange/Black)' },
];

const currencyOptions = [
  { value: 'EUR' as Currency, label: 'Euro (€)', symbol: '€' },
  { value: 'USD' as Currency, label: 'US Dollar ($)', symbol: '$' },
  { value: 'GBP' as Currency, label: 'British Pound (£)', symbol: '£' },
  { value: 'CHF' as Currency, label: 'Swiss Franc (CHF)', symbol: 'CHF' },
];

export default function Settings() {
  const { theme, currency, setTheme, setCurrency } = useSettingsStore();

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'light') {
        root.classList.remove('dark');
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--border', '214.3 31.8% 91.4%');
        root.style.setProperty('--input', '214.3 31.8% 91.4%');
      } else if (theme === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--background', '210 20% 8%');
        root.style.setProperty('--foreground', '210 20% 95%');
        root.style.setProperty('--card', '210 20% 10%');
        root.style.setProperty('--card-foreground', '210 20% 95%');
        root.style.setProperty('--border', '210 20% 18%');
        root.style.setProperty('--input', '210 20% 15%');
      } else if (theme === 'system') {
        // Orange/Black system theme
        root.classList.add('dark');
        root.style.setProperty('--background', '0 0% 0%');
        root.style.setProperty('--foreground', '24 100% 60%');
        root.style.setProperty('--card', '0 0% 5%');
        root.style.setProperty('--card-foreground', '24 100% 60%');
        root.style.setProperty('--border', '24 100% 20%');
        root.style.setProperty('--input', '0 0% 10%');
        root.style.setProperty('--primary', '24 100% 60%');
        root.style.setProperty('--secondary', '0 0% 10%');
      }
    };

    applyTheme();
  }, [theme]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-orange bg-clip-text text-transparent">
          Einstellungen
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalisiere deine App-Einstellungen
        </p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Design & Aussehen</CardTitle>
            <CardDescription>
              Wähle das Erscheinungsbild der Anwendung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Währung</CardTitle>
            <CardDescription>
              Wähle deine bevorzugte Währung für Preise und Berechnungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Währung</Label>
              <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Aktuelle Währung: {currencyOptions.find(c => c.value === currency)?.symbol}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}