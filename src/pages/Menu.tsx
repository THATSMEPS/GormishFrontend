import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, IndianRupee, Package, FileText, Tag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  packagingPrice: number;
  gstCategory: string;
  isAvailable: boolean;
}

const gstCategories = [
  { value: 'non-ac-5', label: 'Restaurants – 5% GST' },
  { value: 'packed-12', label: 'Hotel Premises with Rs 7,500+ Tariff /Pre-cooked Food – 12% GST' },
];

// Dummy data
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 299,
    packagingPrice: 20,
    gstCategory: 'non-ac-5',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in rich, creamy tomato gravy',
    price: 349,
    packagingPrice: 25,
    gstCategory: 'ac-5',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Pasta Alfredo',
    description: 'Creamy pasta with parmesan cheese and garlic',
    price: 249,
    packagingPrice: 20,
    gstCategory: 'non-ac-5',
    isAvailable: false,
  },
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    packagingPrice: 0,
    gstCategory: 'non-ac-5',
    isAvailable: true,
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      packagingPrice: 0,
      gstCategory: 'non-ac-5',
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully');
    }
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
    toast.success('Availability updated');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setMenuItems(prev =>
        prev.map(item =>
          item.id === editingItem.id ? formData : item
        )
      );
      toast.success('Item updated successfully');
    } else {
      setMenuItems(prev => [...prev, formData]);
      toast.success('Item added successfully');
    }
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto pb-12 px-4"
    >
      {/* Fixed Search Bar and Add Item Button */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 pt-10 pb-2 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary truncate"
              />
            </div>
            <button
              onClick={handleAddItem}
              className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex-shrink-0"
              title="Add New Item"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-14">
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <button
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`p-2 rounded-full text-sm font-medium ${
                      item.isAvailable
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                    title={item.isAvailable ? 'Available' : 'Unavailable'}
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <IndianRupee size={16} />
                    <span className="text-sm">Price: ₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package size={16} />
                    <span className="text-sm">Packaging: ₹{item.packagingPrice}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag size={16} />
                    <span className="text-sm">
                      {gstCategories.find(cat => cat.value === item.gstCategory)?.label}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto pb-16">
                <div>
                  <label className="form-label" htmlFor="name">Item Name</label>
                  <div className="input-group">
                    <FileText className="input-group-icon" size={20} />
                    <input
                      id="name"
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter item name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="input-field min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter item description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label" htmlFor="price">Price (₹)</label>
                    <div className="input-group">
                      <IndianRupee className="input-group-icon" size={20} />
                      <input
                        id="price"
                        type="text"
                        min="0"
                        step="0.01"
                        className="input-field"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="packagingPrice">Packaging Price (₹)</label>
                    <div className="input-group">
                      <Package className="input-group-icon" size={20} />
                      <input
                        id="packagingPrice"
                        type="text"
                        min="0"
                        step="0.01"
                        className="input-field"
                        value={formData.packagingPrice}
                        onChange={(e) => setFormData({ ...formData, packagingPrice: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="gstCategory">GST Category</label>
                  <select
                    id="gstCategory"
                    className="input-field"
                    value={formData.gstCategory}
                    onChange={(e) => setFormData({ ...formData, gstCategory: e.target.value })}
                    required
                  >
                    {gstCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isAvailable" className="text-sm text-gray-700">
                    Item is available for ordering
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Menu;