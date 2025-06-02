import { Order } from '../types/orders';

export const dummyOrders: Order[] = [
  {
    id: 'ORD123462',
    date: '2024-03-10',
    customerName: 'David Wilson',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 350 },
      { name: 'Naan', quantity: 2, price: 60 },
      { name: 'Dal Makhani', quantity: 1, price: 250 },
    ],
    total: 720,
    type: 'DELIVERY',
    status: 'All Orders',
    address: '789 Pine St, Delhi',
    time: '3:30 PM',
  },
  {
    id: 'ORD123463',
    date: '2024-03-10',
    customerName: 'Sarah Thompson',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 299 },
      { name: 'Garlic Bread', quantity: 1, price: 149 },
    ],
    total: 448,
    type: 'DELIVERY',
    status: 'All Orders',
    address: '456 Oak St, Delhi',
    time: '3:45 PM',
  },
  {
    id: 'ORD123456',
    date: '2024-03-10',
    customerName: 'John Smith',
    items: [
      { name: 'FarmHouse Pizza', quantity: 2, price: 400 },
      { name: 'Alfredo Pasta', quantity: 1, price: 200 },
    ],
    total: 1000,
    type: 'DELIVERY',
    status: 'Preparing',
    address: '123 Main St, Delhi',
    time: '12:30 PM',
    preparationTime: 30,
  },
  {
    id: 'ORD123457',
    date: '2024-03-10',
    customerName: 'Emma Wilson',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 300 },
      { name: 'Naan', quantity: 2, price: 100 },
    ],
    total: 500,
    type: 'DELIVERY',
    status: 'Ready',
    address: '321 Birch St, Delhi',
    time: '1:15 PM',
  },
];
