export const defaultCategories = [
  "Sneakers", "Boots", "Sandals", "Dress Shoes", "Athletic Shoes",
  "T-Shirts", "Shirts", "Hoodies", "Sweaters", "Tank Tops",
  "Jeans", "Pants", "Shorts", "Skirts", "Leggings",
  "Dresses", "Jackets", "Coats", "Blazers", "Vests",
  "Accessories", "Bags", "Watches", "Jewelry", "Hats",
  "Electronics", "Collectibles", "Home & Living"
];

export const getCategoriesWithCustom = (customCategories: string[] = []): string[] => {
  const allCategories = [...defaultCategories, ...customCategories].sort();
  return [...allCategories, "Others (Custom)"];
};

export const addCustomCategory = (category: string, existingCustom: string[] = []): string[] => {
  const trimmedCategory = category.trim();
  if (!trimmedCategory || existingCustom.includes(trimmedCategory) || defaultCategories.includes(trimmedCategory)) {
    return existingCustom;
  }
  return [...existingCustom, trimmedCategory].sort();
};