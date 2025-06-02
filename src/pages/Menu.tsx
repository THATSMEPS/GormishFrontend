import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MenuHeader from '../components/menu/MenuHeader';
import MenuItemCard from '../components/menu/MenuItemCard';
import MenuItemForm from '../components/menu/MenuItemForm';
import BaseModal from '../components/ui/BaseModal';
import CardGrid from '../components/ui/CardGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { MenuItem, FormData, Addon, ApiResponse, GstCategory } from '../types/menu';

const gstCategories: GstCategory[] = [
  { value: '0', label: '0% (Exempt)' },
  { value: '5', label: '5% GST' },
  { value: '12', label: '12% GST' },
  { value: '18', label: '18% GST' },
  { value: '28', label: '28% GST' },
];

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    gstCategory: '5',
    isAvailable: true,
    addons: [],
  });

  const [addonDraft, setAddonDraft] = useState<Addon>({
    name: '',
    extraPrice: 0,
    available: true,
  });

  const [addonEditIndex, setAddonEditIndex] = useState<number | null>(null);

  // Fetch menu items from backend or localStorage
  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      const restaurantId = localStorage.getItem('restaurantId');

      try {
        // Load menu items from backend
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/items`, {
            headers: { 
              Authorization: `Bearer ${token}`
            },
          });
          const data = await res.json();
          
          if (res.ok && data.success) {
            const menuItems = data.data || [];
            setMenuItems(
              menuItems.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                price: item.price,
                gstCategory: String(item.gstPercentage) || '5',
                isAvailable: item.isAvailable,
                addons: Array.isArray(item.addons) ? item.addons.map((a: any) => ({
                  name: a.name,
                  extraPrice: a.price,
                  available: a.isAvailable,
                })) : [],
              }))
            );
          } else {
            throw new Error(data.message || data.detail || 'Failed to fetch menu items');
          }
          setIsLoading(false);
          return;
        }

        // Fallback: try to load from localStorage if backend fails or not logged in
        const restaurantStr = localStorage.getItem('restaurant');
        if (restaurantStr) {
          const restaurant = JSON.parse(restaurantStr);
          const foodItems = restaurant.foodItems || [];
          setMenuItems(
            foodItems.map((item: any) => ({
              id: item.itemId,
              name: item.name,
              description: item.description || '',
              price: item.price,
              gstCategory: item.gstCategory || '5',
              isAvailable: item.available,
              addons: Array.isArray(item.addons) ? item.addons.map((a: any) => ({
                name: a.name,
                extraPrice: a.extraPrice,
                available: a.available,
              })) : [],
            }))
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load menu items';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [isModalOpen]); // Refetch when modal closes (after add/edit)

  // Filtered items for display
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      gstCategory: '5',
      isAvailable: true,
      addons: [],
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
      } else {
        throw new Error(data.detail || data.message || 'Failed to delete item');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      toast.error(errorMessage);
    }
  };

  const handleToggleAvailability = async (itemId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/items/${itemId}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setMenuItems(prev => prev.map(i => 
          i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i
        ));
        toast.success('Availability updated');
      } else {
        throw new Error(data.detail || data.message || 'Failed to update availability');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update availability';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        gstPercentage: Number(formData.gstCategory),
        isAvailable: formData.isAvailable,
        addons: formData.addons.map(addon => ({
          name: addon.name,
          price: addon.extraPrice,
          isAvailable: addon.available
        }))
      };

      const url = editingItem 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/menu/items/${editingItem.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/menu/items`;

      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
        setIsModalOpen(false);
      } else {
        throw new Error(data.detail || data.message || 'Failed to save item');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save item';
      toast.error(errorMessage);
    }
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
        <MenuHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddItem={handleAddItem}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <CardGrid columns={{ sm: 1, lg: 2, xl: 3 }}>
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onToggleAvailability={() => handleToggleAvailability(item.id)}
              />
            ))}
          </CardGrid>
        )}

        <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <MenuItemForm
            formData={formData}
            setFormData={setFormData}
            addonDraft={addonDraft}
            setAddonDraft={setAddonDraft}
            addonEditIndex={addonEditIndex}
            setAddonEditIndex={setAddonEditIndex}
            gstCategories={gstCategories}
            onSubmit={handleSubmit}
            isEditing={!!editingItem}
          />
        </BaseModal>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Menu;