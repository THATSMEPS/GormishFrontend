import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Select, { SingleValue, MultiValue, StylesConfig } from 'react-select';
import { Store, Mail, MapPin, Clock, Image as ImageIcon, Sun, Moon, Check, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusing the select styles from AuthPage
const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
  control: (base: any) => ({
    ...base,
    minHeight: '42px',
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
    '&:hover': {
      borderColor: '#6552FF',
    },
    boxShadow: 'none',
    '&:focus-within': {
      borderColor: '#6552FF',
      boxShadow: '0 0 0 2px rgba(101, 82, 255, 0.1)',
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#6552FF' : state.isFocused ? '#F3F4F6' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    '&:active': {
      backgroundColor: '#6552FF',
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#EEF2FF',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: '#6552FF',
    fontWeight: 500,
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#6552FF',
    '&:hover': {
      backgroundColor: '#6552FF',
      color: 'white',
    },
  }),
};

const areaOptions = [
  { value: 'north', label: 'North Delhi' },
  { value: 'south', label: 'South Delhi' },
  { value: 'east', label: 'East Delhi' },
  { value: 'west', label: 'West Delhi' },
  { value: 'central', label: 'Central Delhi' },
];

const cuisineOptions = [
  { value: 'indian', label: 'Indian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'thai', label: 'Thai' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
];

const restaurantTypes = [
  { value: 'veg', label: 'Pure Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
  { value: 'both', label: 'Both Veg & Non-Veg' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dummy initial data
  const [profileData, setProfileData] = useState<{
    restaurantName: string;
    email: string;
    description: string;
    address: string;
    image: string;
    serviceArea: { value: string; label: string };
    cuisineTypes: { value: string; label: string }[];
    restaurantType: { value: string; label: string };
  }>({
    restaurantName: 'Tasty Bites Restaurant',
    email: 'contact@tastybites.com',
    description: 'A cozy restaurant serving delicious multi-cuisine dishes in the heart of Delhi.',
    address: '42, Food Street, Connaught Place, New Delhi - 110001',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    serviceArea: { value: 'central', label: 'Central Delhi' },
    cuisineTypes: [
      { value: 'indian', label: 'Indian' },
      { value: 'chinese', label: 'Chinese' },
    ],
    restaurantType: { value: 'both', label: 'Both Veg & Non-Veg' },
  });

  const defaultTimes = {
    open: '09:00',
    close: '22:00',
    isOpen: true
  };

  const [operatingHours, setOperatingHours] = useState<Record<string, { open: string; close: string; isOpen: boolean }>>({
    Monday: { ...defaultTimes },
    Tuesday: { ...defaultTimes },
    Wednesday: { ...defaultTimes },
    Thursday: { ...defaultTimes },
    Friday: { ...defaultTimes },
    Saturday: { ...defaultTimes },
    Sunday: { ...defaultTimes }
  });

  const handleTimeChange = (day: string, type: string, value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const toggleDayStatus = (day: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const copyTimesToAll = (fromDay: string) => {
    const sourceTime = operatingHours[fromDay];
    setOperatingHours(prev => {
      const newHours = { ...prev };
      (Object.keys(newHours) as Array<keyof typeof newHours>).forEach(day => {
        if (day !== fromDay) {
          newHours[day] = { ...sourceTime };
        }
      });
      return newHours;
    });
    toast.success('Operating hours copied to all days');
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    // Set logout state to prevent auto-login
    if (window.ReactNativeWebView) {
      // Clear window.authToken to prevent auto-login after WebView reload
      window.authToken = undefined;
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      // Send LOGOUT message to native app
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'LOGOUT' })
      );
    }
    // Redirect to login page
    window.location.href = '/';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUploadedImage(imageURL);
      setProfileData({ ...profileData, image: imageURL });
    }
  };

  const triggerFileInputClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Prevent back navigation after logout
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-24 md:pb-12"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Restaurant Profile</h1>
            <p className="text-gray-600">Manage your restaurant information and settings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`btn-primary ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Restaurant Image */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="relative h-48 sm:h-64">
            <img
              src={uploadedImage || profileData.image}
              alt="Restaurant"
              className="w-full h-full object-cover cursor-pointer"
              onClick={triggerFileInputClick}
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  ref={fileInputRef}
                />
                <button
                  onClick={triggerFileInputClick}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <ImageIcon size={18} />
                  Change Image
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
              <div className="input-group">
                <Store className="input-group-icon" size={20} />
                <input
                  id="restaurantName"
                  type="text"
                  className="input-field"
                  value={profileData.restaurantName}
                  onChange={(e) => setProfileData({ ...profileData, restaurantName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-group">
                <Mail className="input-group-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="description">Restaurant Description</label>
              <textarea
                id="description"
                className="input-field min-h-[100px]"
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="address">Restaurant Address</label>
              <div className="input-group">
                <MapPin className="input-group-icon" size={20} />
                <textarea
                  id="address"
                  className="input-field min-h-[80px]"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Restaurant Type & Cuisine */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Type & Cuisine</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label" htmlFor="restaurantType">Restaurant Type</label>
              <Select
                id="restaurantType"
                options={restaurantTypes}
                value={profileData.restaurantType}
                onChange={(value: SingleValue<{ value: string; label: string }>) => {
                  if (value) setProfileData({ ...profileData, restaurantType: value });
                }}
                styles={selectStyles}
                isDisabled={!isEditing}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="serviceArea">Service Area</label>
              <Select
                id="serviceArea"
                options={areaOptions}
                value={profileData.serviceArea}
                onChange={(value: SingleValue<{ value: string; label: string }>) => {
                  if (value) setProfileData({ ...profileData, serviceArea: value });
                }}
                styles={selectStyles}
                isDisabled={!isEditing}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="cuisineTypes">Cuisine Types</label>
              <Select
                id="cuisineTypes"
                isMulti
                options={cuisineOptions}
                value={profileData.cuisineTypes as { value: string; label: string }[]}
                onChange={(newValue: MultiValue<{ value: string; label: string }>, _actionMeta) => {
                  setProfileData({ ...profileData, cuisineTypes: Array.from(newValue) });
                }}
                styles={selectStyles}
                isDisabled={!isEditing}
              />
            </div>
          </div>
        </motion.div>

        {/* Operating Hours */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Operating Hours</h2>
            {isEditing && (
              <button
                onClick={() => copyTimesToAll('Monday')}
                className="text-sm text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Check size={16} />
                Copy Monday's hours to all days
              </button>
            )}
          </div>

          <div className="space-y-3">
            {Object.entries(operatingHours).map(([day, times]) => (
              <div
                key={day}
                className={`p-4 rounded-lg transition-colors ${
                  times.isOpen ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">{day}</span>
                  {isEditing && (
                    <button
                      onClick={() => toggleDayStatus(day)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                        times.isOpen
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {times.isOpen ? <Sun size={16} /> : <Moon size={16} />}
                      {times.isOpen ? 'Open' : 'Closed'}
                    </button>
                  )}
                </div>

                {times.isOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block" htmlFor={`${day}-open`}>
                        Opening Time
                      </label>
                      <input
                        id={`${day}-open`}
                        type="time"
                        className="input-field"
                        value={times.open}
                        onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block" htmlFor={`${day}-close`}>
                        Closing Time
                      </label>
                      <input
                        id={`${day}-close`}
                        type="time"
                        className="input-field"
                        value={times.close}
                        onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
