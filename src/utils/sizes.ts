export interface SizeCategory {
  label: string;
  sizes: string[];
}

export const sizeCategoriesByType: Record<string, SizeCategory[]> = {
  // Schuhe
  schuhe: [
    {
      label: "EU Größen",
      sizes: ["35", "35.5", "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", "44", "44.5", "45", "45.5", "46", "46.5", "47", "47.5", "48", "48.5", "49", "50"]
    },
    {
      label: "US Herren",
      sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "15"]
    },
    {
      label: "US Damen",
      sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"]
    },
    {
      label: "UK Größen",
      sizes: ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14"]
    }
  ],

  // T-Shirts & Oberteile
  "t-shirts": [
    {
      label: "Standard Größen",
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    },
    {
      label: "Numerische Größen",
      sizes: ["34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56"]
    }
  ],

  // Hosen
  hosen: [
    {
      label: "Taille/Länge (W/L)",
      sizes: ["28/30", "28/32", "29/30", "29/32", "30/30", "30/32", "30/34", "31/30", "31/32", "31/34", "32/30", "32/32", "32/34", "33/30", "33/32", "33/34", "34/30", "34/32", "34/34", "34/36", "36/30", "36/32", "36/34", "36/36", "38/30", "38/32", "38/34", "40/30", "40/32", "42/32"]
    },
    {
      label: "Deutsche Größen",
      sizes: ["44", "46", "48", "50", "52", "54", "56", "58", "60", "62"]
    },
    {
      label: "Standard Größen",
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    }
  ],

  // Jacken & Mäntel
  jacken: [
    {
      label: "Standard Größen",
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    },
    {
      label: "Deutsche Größen",
      sizes: ["44", "46", "48", "50", "52", "54", "56", "58", "60"]
    }
  ],

  // Kleider & Röcke
  kleider: [
    {
      label: "Deutsche Größen",
      sizes: ["32", "34", "36", "38", "40", "42", "44", "46", "48", "50"]
    },
    {
      label: "Standard Größen",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    }
  ],

  // Accessoires
  accessoires: [
    {
      label: "Gürtel (cm)",
      sizes: ["75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125"]
    },
    {
      label: "Mützen",
      sizes: ["One Size", "S", "M", "L", "XL"]
    },
    {
      label: "Handschuhe",
      sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]
    }
  ]
};

// Zuordnung von Kategorie-Namen zu Größentypen
export const categoryToSizeType: Record<string, string> = {
  // Schuhe
  "schuhe": "schuhe",
  "sneaker": "schuhe", 
  "boots": "schuhe",
  "sandalen": "schuhe",
  "pumps": "schuhe",
  "flip-flops": "schuhe",

  // Oberteile
  "t-shirts": "t-shirts",
  "shirts": "t-shirts",
  "tank tops": "t-shirts",
  "langarmshirts": "t-shirts",
  "pullover": "t-shirts",
  "hoodies": "t-shirts",
  "sweatshirts": "t-shirts",
  "blusen": "t-shirts",

  // Hosen
  "hosen": "hosen",
  "jeans": "hosen",
  "shorts": "hosen",
  "jogginghosen": "hosen",
  "leggings": "hosen",
  "chinos": "hosen",

  // Jacken
  "jacken": "jacken",
  "mäntel": "jacken",
  "blazer": "jacken",
  "westen": "jacken",

  // Kleider & Röcke
  "kleider": "kleider",
  "röcke": "kleider",
  "jumpsuits": "kleider",

  // Accessoires
  "accessoires": "accessoires",
  "gürtel": "accessoires",
  "taschen": "accessoires",
  "mützen": "accessoires",
  "handschuhe": "accessoires",
  "schals": "accessoires"
};

export function getSizeSuggestionsForCategory(category: string): SizeCategory[] {
  const normalizedCategory = category.toLowerCase();
  const sizeType = categoryToSizeType[normalizedCategory];
  
  if (sizeType && sizeCategoriesByType[sizeType]) {
    return sizeCategoriesByType[sizeType];
  }
  
  // Fallback: versuche Teilstring-Matching
  for (const [key, value] of Object.entries(categoryToSizeType)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return sizeCategoriesByType[value] || [];
    }
  }
  
  // Standard Fallback
  return [
    {
      label: "Allgemeine Größen",
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    }
  ];
}

export function getAllSizesForCategory(category: string): string[] {
  const suggestions = getSizeSuggestionsForCategory(category);
  return suggestions.flatMap(suggestion => suggestion.sizes);
}