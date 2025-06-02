import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import OnlineToggle from './OnlineToggle';

interface OrdersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isOnline: boolean;
  onOnlineChange: (value: boolean) => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  searchQuery,
  onSearchChange,
  isOnline,
  onOnlineChange,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 pt-10 pb-2 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <OnlineToggle isOnline={isOnline} onChange={onOnlineChange} />
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
