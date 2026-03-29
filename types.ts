
export enum OrderStatus {
  NEW = 'جديد',
  IN_PRINTING = 'قيد الطباعة',
  READY = 'جاهز',
  DELIVERED = 'تم التسليم'
}

export interface OrderItem {
  description: string;
  length: number;
  width: number;
  quantity: number;
  pricePerSqm: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  pin: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  pin: string;
  createdAt: string;
}

export interface ProductPrice {
  id: string;
  name: string;
  clientPrice: number;
  wholesalePrice: number;
}

export interface AgencySettings {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  description: string; // Summary of items
  items: OrderItem[];
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  status: OrderStatus;
  createdAt: string;
  dueDate: string;
}

export interface AuthState {
  user: {
    id: string;
    role: 'ADMIN' | 'CLIENT' | 'WORKER';
    name: string;
    phone?: string;
  } | null;
}

export interface Statistics {
  totalOrders: number;
  totalIncome: number;
  activeOrders: number;
  completedOrders: number;
}
