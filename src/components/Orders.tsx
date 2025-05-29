import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Clock, MapPin, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const orderStates = ['All Orders', 'Preparing', 'Ready'];

const dummyOrders = [
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

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(dummyOrders);

  const filteredOrders = orders.filter(order =>
    order.status === activeTab &&
    (searchQuery === '' ||
     order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleStatusChange = (orderId, newStatus) => {
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

  const handleApproveOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Preparing' } : order
      )
    );
    toast.success('Order approved successfully');
  };

  const handleRejectOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.filter(order => order.id !== orderId)
    );
    toast.error('Order rejected');
  };

  return (
    <>
      <div className="responsive-container px-4">
        {/* Fixed Search Bar and Online/Offline Toggle */}
        <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 pt-10 pb-2 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, customer or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary truncate"
              />
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isOnline}
                onChange={() => setIsOnline(!isOnline)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ms-3 text-sm font-medium truncate">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </label>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Order Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {orderStates.map((state) => (
                <button
                  key={state}
                  onClick={() => setActiveTab(state)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex-1 sm:flex-none min-w-[100px] ${
                    activeTab === state
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">{order.customerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600`}>
                      {order.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span>#{order.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{order.time}</span>
                    </div>
                  </div>

                  {order.address && (
                    <div className="flex items-start gap-1.5 mt-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{order.address}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-4 bg-gray-50">
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                            {item.quantity}
                          </span>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-gray-600">₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-medium">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="text-primary text-lg">₹{order.total}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 bg-white border-t border-gray-100">
                  {activeTab === 'All Orders' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      >
                        <Check size={16} />
                        Approve Order
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <X size={16} />
                        Reject Order
                      </button>
                    </div>
                  )}
                  {activeTab === 'Preparing' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'Ready')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {activeTab === 'Ready' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'Dispatched')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    >
                      Dispatch Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;