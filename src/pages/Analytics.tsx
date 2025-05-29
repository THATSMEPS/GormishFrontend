import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import Select from 'react-select';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Star,
  Calendar,
  Search,
  XCircle,
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const dateRangeOptions = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

// Generate dummy data for charts
const generateDummyData = (days) => {
  const endDate = new Date();
  const startDate = days === 'all' ? new Date(2020, 0, 1) : subDays(endDate, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map(date => ({
    date: format(date, 'MMM dd'),
    sales: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 100) + 20,
    customers: Math.floor(Math.random() * 50) + 10,
  }));
};

const generateDummyOrders = () => {
  const orders = [];
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date();

  for (let i = 0; i < 50; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    orders.push({
      id: 123456 + i,
      customer: `Customer ${i + 1}`,
      items: '2× Pizza, 1× Pasta',
      total: Math.floor(Math.random() * 5000) + 1000,
      status: 'Completed',
      date: format(randomDate, 'MMM dd, yyyy'),
    });
  }
  return orders;
};

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState(dateRangeOptions[0]);
  const [data, setData] = useState(generateDummyData(7));
  const [orders, setOrders] = useState(generateDummyOrders());
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(generateDummyData(selectedRange.value === 'all' ? 'all' : parseInt(selectedRange.value)));
      setIsLoading(false);
    };

    fetchData();
  }, [selectedRange]);

  useEffect(() => {
    const filterOrders = () => {
      return orders.filter(order =>
        (order.id.toString().includes(searchQuery) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedDate ? order.date === format(new Date(selectedDate), 'MMM dd, yyyy') : true)
      );
    };

    setFilteredOrders(filterOrders());
  }, [searchQuery, selectedDate, orders]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDate('');
  };

  const totalSales = data.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = data.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalSales / totalOrders;
  const customerSatisfaction = 4.5;

  const metrics = [
    {
      title: 'Total Sales',
      value: `₹${totalSales.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      title: 'Avg. Order Value',
      value: `₹${averageOrderValue.toFixed(2)}`,
      icon: Users,
    },
    {
      title: 'Customer Satisfaction',
      value: `${customerSatisfaction}/5`,
      icon: Star,
    },
  ];

  const salesChartData = {
    labels: data.map(day => day.date),
    datasets: [
      {
        label: 'Sales',
        data: data.map(day => day.sales),
        borderColor: '#6552FF',
        backgroundColor: 'rgba(101, 82, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels: data.map(day => day.date),
    datasets: [
      {
        label: 'Orders',
        data: data.map(day => day.orders),
        backgroundColor: '#6552FF',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              });
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto pb-12 px-4"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h1>
          <Select
            value={selectedRange}
            onChange={(value) => setSelectedRange(value)}
            options={dateRangeOptions}
            className="w-full max-w-[200px] sm:w-48"
            isSearchable={false}
            isDisabled={isLoading}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center text-center"
          >
            <div className="p-2 bg-primary/10 rounded-lg mb-3">
              <metric.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm mb-1">{metric.title}</h3>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-[300px]">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h2>
          <div className="h-[300px]">
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full"
              />
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto justify-center"
            >
              <XCircle size={20} />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-800">#{order.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{order.customer}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{order.items}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-800">₹{order.total}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;