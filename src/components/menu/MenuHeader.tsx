import React from 'react';
import { Plus } from 'lucide-react';

interface MenuHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddItem: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ searchQuery, onSearchChange, onAddItem }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1 max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search menu items..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <button
        onClick={onAddItem}
        className="ml-4 px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary-dark"
      >
        <Plus size={20} />
        Add Item
      </button>
    </div>
  );
};

export default MenuHeader;
