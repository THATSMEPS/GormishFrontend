import React from 'react';
import { X } from 'lucide-react';
import { FormData, Addon, GstCategory } from '../../types/menu';

interface MenuItemFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  addonDraft: Addon;
  setAddonDraft: React.Dispatch<React.SetStateAction<Addon>>;
  addonEditIndex: number | null;
  setAddonEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
  gstCategories: GstCategory[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  formData,
  setFormData,
  addonDraft,
  setAddonDraft,
  addonEditIndex,
  setAddonEditIndex,
  gstCategories,
  onSubmit,
  isEditing,
}) => {
  const handleAddAddon = () => {
    if (!addonDraft.name || addonDraft.extraPrice < 0) return;

    if (addonEditIndex !== null) {
      setFormData(prev => ({
        ...prev,
        addons: prev.addons.map((addon, index) =>
          index === addonEditIndex ? { ...addonDraft } : addon
        ),
      }));
      setAddonEditIndex(null);
    } else {
      setFormData(prev => ({
        ...prev,
        addons: [...prev.addons, { ...addonDraft }],
      }));
    }

    setAddonDraft({
      name: '',
      extraPrice: 0,
      available: true,
    });
  };

  const handleEditAddon = (index: number) => {
    setAddonDraft(formData.addons[index]);
    setAddonEditIndex(index);
  };

  const handleDeleteAddon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">GST Category</label>
        <select
          value={formData.gstCategory}
          onChange={e => setFormData(prev => ({ ...prev, gstCategory: e.target.value }))}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          {gstCategories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={e => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
            className="rounded text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700">Available</span>
        </label>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Addons</h3>
        
        <div className="space-y-4 mb-6">
          {formData.addons.map((addon, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-md">
              <div className="flex-1">
                <p className="font-medium">{addon.name}</p>
                <p className="text-sm text-gray-600">₹{addon.extraPrice}</p>
              </div>
              <button
                type="button"
                onClick={() => handleEditAddon(index)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAddon(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Addon name"
            value={addonDraft.name}
            onChange={e => setAddonDraft(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <input
            type="number"
            placeholder="Extra price"
            min="0"
            value={addonDraft.extraPrice}
            onChange={e => setAddonDraft(prev => ({ ...prev, extraPrice: parseFloat(e.target.value) }))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addonDraft.available}
              onChange={e => setAddonDraft(prev => ({ ...prev, available: e.target.checked }))}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Available</span>
          </label>
          <button
            type="button"
            onClick={handleAddAddon}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {addonEditIndex !== null ? 'Update Addon' : 'Add Addon'}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          {isEditing ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
