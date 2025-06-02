import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import OrdersHeader from './orders/OrdersHeader';
import OrderStatusTabs from './orders/OrderStatusTabs';
import OrderCard from './orders/OrderCard';
import CardGrid from './ui/CardGrid';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import { Order, OrderStatus } from '../types/orders';
import { dummyOrders } from '../data/dummyOrders';

const orderStates: OrderStatus[] = ['All Orders', 'Preparing', 'Ready'];

interface OrderCardData {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
  timestamp: string;
}

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('All Orders');
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>(dummyOrders);

  const filteredOrders = orders.filter(order =>
    (order.status === activeTab || activeTab === 'All Orders') &&
    (searchQuery === '' ||
     order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Dispatched') {
      setOrders(prevOrders =>
        prevOrders.filter(order => order.id !== orderId)
      );
      toast.success('Order dispatched');
    } else {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order updated to ${newStatus}`);
    }
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Preparing' } : order
      )
    );
    toast.success('Order approved successfully');
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.filter(order => order.id !== orderId)
    );
    toast.error('Order rejected');
  };

  const orderToCardData = (order: Order): OrderCardData => ({
    id: order.id,
    customer: order.customerName,
    items: order.items.map(item => `${item.quantity}× ${item.name}`).join(', '),
    total: order.total,
    status: order.status,
    timestamp: `${order.date} ${order.time}`,
  });

  return (
    <ErrorBoundary>
      <div className="responsive-container px-4">
        <OrdersHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOnline={isOnline}
          onOnlineChange={setIsOnline}
        />

        {/* Scrollable Content */}
        <div className="pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <OrderStatusTabs
              orderStates={orderStates}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </motion.div>

          {/* Orders Grid */}
          <Suspense fallback={<LoadingSpinner />}>
            <CardGrid columns={{ sm: 1, lg: 2, xl: 3 }}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={orderToCardData(order)}
                  activeTab={activeTab}
                  onApprove={() => handleApproveOrder(order.id)}
                  onReject={() => handleRejectOrder(order.id)}
                  onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                />
              ))}
            </CardGrid>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Orders;