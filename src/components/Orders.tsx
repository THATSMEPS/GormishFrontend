import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, User, Clock, MapPin, Edit2, Check } from 'lucide-react';
import AddOrderModal from './AddOrderModal';
import { toast } from 'react-hot-toast';

const orderStates = ['Preparing', 'Ready', 'Dispatched'];

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
    type: 'DINE-IN',
    status: 'Preparing',
    tableNo: '12',
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
    type: 'DINE-IN',
    status: 'Preparing',
    tableNo: '15',
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
    type: 'PARCEL',
    status: 'Ready',
    time: '1:15 PM',
  },
  {
    id: 'ORD123458',
    date: '2024-03-10',
    customerName: 'Michael Brown',
    items: [
      { name: 'Sushi Roll', quantity: 3, price: 600 },
    ],
    total: 600,
    type: 'DINE-IN',
    status: 'Dispatched',
    time: '2:00 PM',
    tableNo: '12',
  },
  {
    id: 'ORD123459',
    date: '2024-03-10',
    customerName: 'Alice Johnson',
    items: [
      { name: 'Burger', quantity: 1, price: 250 },
    ],
    total: 250,
    type: 'DELIVERY',
    status: 'Preparing',
    address: '456 Elm St, Delhi',
    time: '12:45 PM',
    preparationTime: 20,
  },
  {
    id: 'ORD123460',
    date: '2024-03-10',
    customerName: 'Bob Davis',
    items: [
      { name: 'Salad', quantity: 1, price: 150 },
    ],
    total: 150,
    type: 'PARCEL',
    status: 'Ready',
    time: '1:30 PM',
  },
  {
    id: 'ORD123461',
    date: '2024-03-10',
    customerName: 'Charlie Miller',
    items: [
      { name: 'Pasta', quantity: 1, price: 300 },
    ],
    total: 300,
    type: 'DINE-IN',
    status: 'Dispatched',
    time: '2:15 PM',
    tableNo: '15',
  },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState('Preparing');
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState(dummyOrders);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const filteredOrders = orders.filter(order =>
    order.status === activeTab &&
    (searchQuery === '' ||
     order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handlePreparationTimeChange = (orderId, increment) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, preparationTime: Math.max(0, order.preparationTime + (increment ? 5 : -5)) }
          : order
      )
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDispatchOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Dispatched' } : order
      )
    );
    toast.success('Order dispatched successfully');
  };

  return (
    <>
      <div className="responsive-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isOnline}
                  onChange={() => setIsOnline(!isOnline)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ms-3 text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </label>
              <button
                className="btn-primary whitespace-nowrap"
                onClick={() => setIsAddOrderModalOpen(true)}
              >
                <Plus size={18} />
                <span>Add Order</span>
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-input-group mb-6">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search orders by ID, customer or items..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Order Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
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
                  <h3 className="font-semibold text-gray-800">#{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.type === 'DELIVERY'
                      ? 'bg-blue-50 text-blue-600'
                      : order.type === 'PARCEL'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-purple-50 text-purple-600'
                  }`}>
                    {order.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User size={16} />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{order.time}</span>
                  </div>
                </div>

                {order.type === 'DELIVERY' && order.address && (
                  <div className="flex items-start gap-1.5 mt-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{order.address}</span>
                  </div>
                )}

                {order.type === 'DINE-IN' && order.tableNo && (
                  <div className="mt-2 text-sm text-gray-600">
                    Table: #{order.tableNo}
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
                {order.type === 'DINE-IN' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Order
                    </button>
                    <button
                      onClick={() => handleDispatchOrder(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    >
                      <Check size={16} />
                      Dispatch
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {orderStates.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStatusChange(order.id, state)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          order.status === state
                            ? 'bg-primary text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
      />

      <AddOrderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingOrder(null);
        }}
        editingOrder={editingOrder}
      />
    </>
  );
};

export default Orders;