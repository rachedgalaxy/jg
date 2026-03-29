
import { OrderStatus, Client, Order } from './types';

export const ADMIN_PHONE = "0672383396";
export const ADMIN_PIN = "0000";

export const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'أحمد محمد', phone: '0550123456', pin: '1111', createdAt: new Date().toISOString() },
  { id: '2', name: 'مؤسسة النور', phone: '0560123456', pin: '2222', createdAt: new Date().toISOString() },
];

export const INITIAL_ORDERS: Order[] = [
  { 
    id: 'ORD-1001', 
    clientId: '1', 
    clientName: 'أحمد محمد',
    description: 'كروت شخصية', 
    items: [
      { description: 'كروت شخصية', length: 0.09, width: 0.05, quantity: 500, pricePerSqm: 5000 }
    ],
    totalPrice: 250, 
    paidAmount: 250,
    remainingAmount: 0,
    status: OrderStatus.READY, 
    createdAt: new Date().toISOString(),
    dueDate: '2024-06-20'
  },
  { 
    id: 'ORD-1002', 
    clientId: '2', 
    clientName: 'مؤسسة النور',
    description: 'لافتة إعلانية', 
    items: [
      { description: 'لافتة إعلانية', length: 2, width: 1, quantity: 1, pricePerSqm: 1200 }
    ],
    totalPrice: 2400, 
    paidAmount: 1000,
    remainingAmount: 1400,
    status: OrderStatus.IN_PRINTING, 
    createdAt: new Date().toISOString(),
    dueDate: '2024-06-25'
  }
];
