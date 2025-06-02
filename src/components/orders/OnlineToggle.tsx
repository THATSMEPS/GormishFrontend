import React from 'react';
import { Sun } from 'lucide-react';

interface OnlineToggleProps {
  isOnline: boolean;
  onChange: (isOnline: boolean) => void;
}

const OnlineToggle: React.FC<OnlineToggleProps> = ({ isOnline, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOnline}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      <span className="ms-3 text-sm font-medium truncate">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </label>
  );
};

export default OnlineToggle;
