

export interface Product {
    asin: string;
    title: string;
    price: number;
    rating: number;
    reviews: number;
    category: string;
  }
  

  export const referenceProduct: Product = {
    asin: "B0XYZ123",
    title: "ProBrand Steel Bottle 32oz Insulated",
    price: 29.99,
    rating: 4.2,
    reviews: 1247,
    category: "Sports & Outdoors",
  };
  
 
  export const candidateProducts: Product[] = [
    { asin: "B0COMP01", title: "HydroFlask 32oz Wide Mouth", price: 44.99, rating: 4.5, reviews: 8932, category: "Sports & Outdoors" },
    { asin: "B0COMP02", title: "Yeti Rambler 26oz", price: 34.99, rating: 4.4, reviews: 5621, category: "Sports & Outdoors" },
    { asin: "B0COMP03", title: "Generic Water Bottle", price: 8.99, rating: 3.2, reviews: 45, category: "Sports & Outdoors" },
    { asin: "B0COMP04", title: "Bottle Cleaning Brush Set", price: 12.99, rating: 4.6, reviews: 3421, category: "Kitchen" },
    { asin: "B0COMP05", title: "Replacement Lid for HydroFlask", price: 9.99, rating: 4.1, reviews: 892, category: "Accessories" },
    { asin: "B0COMP06", title: "Stanley Adventure Quencher", price: 35.00, rating: 4.3, reviews: 4102, category: "Sports & Outdoors" },
    { asin: "B0COMP07", title: "Contigo Autoseal Water Bottle", price: 24.99, rating: 4.2, reviews: 2341, category: "Sports & Outdoors" },
    { asin: "B0COMP08", title: "Premium Titanium Bottle", price: 89.00, rating: 4.8, reviews: 234, category: "Sports & Outdoors" },
    { asin: "B0COMP09", title: "Water Bottle Carrier Bag", price: 15.99, rating: 4.0, reviews: 567, category: "Accessories" },
    { asin: "B0COMP10", title: "Thermos Stainless King 40oz", price: 39.99, rating: 4.4, reviews: 3892, category: "Sports & Outdoors" },
  ];
  

  export const mockKeywords = [
    "stainless steel water bottle insulated",
    "vacuum insulated bottle 32oz",
    "sports water bottle metal",
  ];