import React from 'react';
import { OrderStatus } from '../../types/orders';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface OrderData {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
  timestamp: string;
}

interface OrderCardProps {
  order: OrderData;
  activeTab: OrderStatus;
  onApprove: () => void;
  onReject: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  activeTab,
  onApprove,
  onReject,
  onStatusChange,
}) => {
  const { id, customer, items, total, status, timestamp } = order;

  const renderActions = () => {
    if (activeTab === 'All Orders') {
      return (
        <div className="flex gap-2">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Check size={16} />}
            onClick={onApprove}
          >
            Approve Order
          </Button>
          <Button
            variant="danger"
            fullWidth
            leftIcon={<X size={16} />}
            onClick={onReject}
          >
            Reject Order
          </Button>
        </div>
      );
    }

    if (activeTab === 'Preparing') {
      return (
        <Button
          variant="primary"
          fullWidth
          onClick={() => onStatusChange('Ready')}
        >
          Mark as Ready
        </Button>
      );
    }

    if (activeTab === 'Ready') {
      return (
        <Button
          variant="primary"
          fullWidth
          onClick={() => onStatusChange('Dispatched')}
        >
          Dispatch Order
        </Button>
      );
    }

    return null;
  };

  return (
    <Card>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">#{id}</h3>
            <p className="text-gray-600">{customer}</p>
          </div>
          <span className="text-sm font-medium text-gray-500">{timestamp}</span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-600">{items}</p>
          <p className="text-lg font-semibold text-gray-800">₹{total}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">₹{total}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {status}
          </span>
        </div>
        {renderActions()}
      </motion.div>
    </Card>
  );
};

export default OrderCard;
