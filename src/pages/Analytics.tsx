import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { format } from 'date-fns';
import { TrendingUp, Users, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import components
import Header from '../components/analytics/Header';
import MetricsCard from '../components/analytics/MetricsCard';
import SalesChart from '../components/analytics/SalesChart';
import OrdersChart from '../components/analytics/OrdersChart';
import RecentOrdersTable from '../components/analytics/RecentOrdersTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

// Import utils and types
import { generateDummyData, generateDummyOrders, salesChartOptions, ordersChartOptions } from '../utils/analytics';
import { AnalyticsData, Order, DateRange, MetricCard, SalesChartData, OrdersChartData } from '../types/analytics';

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

const dateRangeOptions: DateRange[] = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

const Analytics: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRangeOptions[0]);
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newData = generateDummyData(parseInt(selectedRange.value));
        setData(newData);
      } catch (err) {
        setError('Failed to fetch analytics data');
        toast.error('Failed to fetch analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  useEffect(() => {
    if (!orders.length) {
      try {
        const dummyOrders = generateDummyOrders();
        setOrders(dummyOrders);
      } catch (err) {
        toast.error('Failed to load orders');
      }
    }
  }, []);

  useEffect(() => {
    const filterOrders = () => {
      return orders.filter(order =>
        (order.id.toString().includes(searchQuery) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedDate ? format(new Date(selectedDate), 'MMM dd, yyyy') === order.date : true)
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
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const customerSatisfaction = 4.5;

  const metrics: MetricCard[] = [
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

  const salesChartData: SalesChartData = {
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

  const ordersChartData: OrdersChartData = {
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto pb-12 px-4"
      >
        <Header
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <MetricsCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  index={index}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h2>
                <SalesChart data={salesChartData} options={salesChartOptions} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h2>
                <OrdersChart data={ordersChartData} options={ordersChartOptions} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <RecentOrdersTable
                orders={filteredOrders}
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                onSearchChange={setSearchQuery}
                onDateChange={setSelectedDate}
                onClearFilters={handleClearFilters}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default Analytics;