import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import Card from '../ui/Card';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const { name, description, price, isAvailable, addons } = item;

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">₹{price}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={onToggleAvailability}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-gray-600">
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </label>
        </div>

        {addons.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add-ons:</h4>
            <div className="space-y-2">
              {addons.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className={addon.available ? 'text-gray-600' : 'text-gray-400'}>
                    {addon.name}
                    {!addon.available && ' (Unavailable)'}
                  </span>
                  <span className="text-gray-600">+₹{addon.extraPrice}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuItemCard;
