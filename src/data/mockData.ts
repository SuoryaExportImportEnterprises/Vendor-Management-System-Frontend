export interface VendorProduct {
  _id: string;
  vendorName: string;
  companyName: string;
  vendorState: string;
  vendorCity: string;
  otherAreaName: string | null;
  vendorAddress: string;
  gstNumber: string;
  phone: string;
  email: string;
  visitingCardImageUrl: string;
  productCategory: string;
  productDescription: string;
  priceRange: string;
  productImageUrl: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

export const mockVendorProducts: VendorProduct[] = [
  {
    _id: "1",
    vendorName: "Rajesh Kumar",
    companyName: "Kumar Electronics Pvt Ltd",
    vendorState: "Maharashtra",
    vendorCity: "Mumbai",
    otherAreaName: null,
    vendorAddress: "Shop 12, Andheri East Market, Mumbai",
    gstNumber: "27ABCDE1234F1Z5",
    phone: "9876543210",
    email: "rajesh@kumarelectronics.com",
    visitingCardImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    productCategory: "Electronics",
    productDescription: "LED TVs, Smart TVs, Home Theater Systems",
    priceRange: "₹15,000 - ₹1,50,000",
    productImageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    keywords: "tv, electronics, smart tv, led",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    _id: "2",
    vendorName: "Priya Sharma",
    companyName: "Sharma Textiles Ltd",
    vendorState: "Gujarat",
    vendorCity: "Ahmedabad",
    otherAreaName: null,
    vendorAddress: "Plot 45, Textile Market, Ahmedabad",
    gstNumber: "24XYZAB5678G2Z9",
    phone: "9988776655",
    email: "priya@sharmatextiles.com",
    visitingCardImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    productCategory: "Textiles",
    productDescription: "Cotton Fabrics, Silk Sarees, Designer Suits",
    priceRange: "₹500 - ₹50,000",
    productImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
    keywords: "fabric, textile, saree, cotton, silk",
    createdAt: "2024-01-16T11:45:00Z",
    updatedAt: "2024-01-16T11:45:00Z"
  },
  {
    _id: "3",
    vendorName: "Amit Patel",
    companyName: "Patel Hardware Solutions",
    vendorState: "Karnataka",
    vendorCity: "Bangalore",
    otherAreaName: null,
    vendorAddress: "Building 7, Electronic City Phase 1, Bangalore",
    gstNumber: "29PQRST9012H3Z1",
    phone: "9123456789",
    email: "amit@patelhardware.com",
    visitingCardImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    productCategory: "Computer Hardware",
    productDescription: "Laptops, Desktops, Processors, RAM",
    priceRange: "₹5,000 - ₹2,00,000",
    productImageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    keywords: "computer, laptop, hardware, processor",
    createdAt: "2024-01-17T09:20:00Z",
    updatedAt: "2024-01-17T09:20:00Z"
  },
  {
    _id: "4",
    vendorName: "Sunita Desai",
    companyName: "Desai Furniture House",
    vendorState: "Rajasthan",
    vendorCity: "Jaipur",
    otherAreaName: null,
    vendorAddress: "Shop 23, MI Road, Jaipur",
    gstNumber: "08DEFGH3456I4Z2",
    phone: "9876501234",
    email: "sunita@desaifurniture.com",
    visitingCardImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    productCategory: "Furniture",
    productDescription: "Wooden Furniture, Office Furniture, Home Decor",
    priceRange: "₹2,000 - ₹80,000",
    productImageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    keywords: "furniture, wooden, office, home decor",
    createdAt: "2024-01-18T14:10:00Z",
    updatedAt: "2024-01-18T14:10:00Z"
  },
  {
    _id: "5",
    vendorName: "Vikram Singh",
    companyName: "Singh Auto Parts",
    vendorState: "Uttar Pradesh",
    vendorCity: "Others",
    otherAreaName: "Noida Sector 62",
    vendorAddress: "Plot 101, Noida Sector 62",
    gstNumber: "09IJKLM7890J5Z3",
    phone: "9765432109",
    email: "vikram@singhauto.com",
    visitingCardImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    productCategory: "Automobile Parts",
    productDescription: "Spare Parts, Tyres, Batteries, Oils",
    priceRange: "₹100 - ₹50,000",
    productImageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    keywords: "auto parts, spare parts, tyres, batteries",
    createdAt: "2024-01-19T16:30:00Z",
    updatedAt: "2024-01-19T16:30:00Z"
  }
];

export const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const citiesByState: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Others"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Others"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Others"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Others"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Others"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Others"],
  "Delhi": ["New Delhi", "Others"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Others"],
  // Add all other states with "Others" as default
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Others"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Others"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Others"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Others"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Others"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Others"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Others"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Others"],
};

export const productCategories = [
  "Electronics",
  "Textiles",
  "Computer Hardware",
  "Furniture",
  "Automobile Parts",
  "Food & Beverages",
  "Machinery",
  "Construction Materials",
  "Medical Equipment",
  "Stationery",
  "Agricultural Products",
  "Chemicals",
  "Packaging Materials",
  "Others"
];
