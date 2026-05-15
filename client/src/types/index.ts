export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  _id?: string;
  id: string;
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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  _id?: string;
  productId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  id: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  status: "Pending" | "Confirmed" | "Delivered";
  date: string;
  couponCode?: string;
  paymentMethod: "Card" | "UPI" | "Cash on Delivery";
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}
