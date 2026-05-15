export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profileImage?: string;
  status?: "active" | "blocked";
  createdAt?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  brand: string;
  reviews: number;
  features: string[];
  tags: string[];
  badge?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  _id?: string;
  product: string | Product;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalPrice: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
