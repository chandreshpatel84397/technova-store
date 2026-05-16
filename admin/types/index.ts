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
  brand: string;
  reviews: number;
  features: string[];
  tags: string[];
  badge?: string;
}

export interface OrderItem {
  product: string;
  title: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

export interface Order {
  _id: string;
  user: {
    _id?: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  profileImage?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders?: Order[];
}

export interface SalesRecord {
  _id: string;
  totalSales: number;
  count: number;
  name?: string;
}
