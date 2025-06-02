export type OrderStatus = 'All Orders' | 'Preparing' | 'Ready' | 'Dispatched';
export type OrderType = 'DELIVERY' | 'PICKUP';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  type: OrderType;
  status: OrderStatus;
  address: string;
  time: string;
  preparationTime?: number;
}
