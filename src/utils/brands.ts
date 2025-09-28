export const popularBrands = [
  // Sneakers & Sports
  "Nike", "Adidas", "Jordan", "Puma", "Reebok", "New Balance", "Converse", "Vans",
  "Asics", "Under Armour", "Salomon", "Merrell", "Timberland",
  
  // Luxury Fashion
  "Gucci", "Louis Vuitton", "Prada", "Hermès", "Chanel", "Balenciaga", "Versace",
  "Dolce & Gabbana", "Armani", "Hugo Boss", "Burberry", "Dior", "Givenchy",
  
  // Streetwear & Casual
  "Supreme", "Off-White", "Stone Island", "CP Company", "Palm Angels", "Fear of God",
  "Kith", "Bape", "Anti Social Social Club", "Stussy", "Champion", "Tommy Hilfiger",
  "Calvin Klein", "Ralph Lauren", "Lacoste",
  
  // Outdoor & Workwear
  "Patagonia", "The North Face", "Arc'teryx", "Carhartt", "Dickies", "Fjällräven",
  "Columbia", "Mammut", "Barbour",
  
  // Denim & Casual
  "Levi's", "Diesel", "G-Star RAW", "True Religion", "7 For All Mankind",
  "Citizens of Humanity", "Acne Studios",
  
  // Tech & Accessories
  "Apple", "Samsung", "Rolex", "Omega", "Casio", "Seiko", "Ray-Ban", "Oakley"
].sort();

export const getBrandSuggestions = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  return popularBrands
    .filter(brand => brand.toLowerCase().includes(normalizedQuery))
    .slice(0, 10);
};