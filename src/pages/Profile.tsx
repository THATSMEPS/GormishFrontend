import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Select, { SingleValue, MultiValue, StylesConfig } from 'react-select';
import { Store, Mail, MapPin, Clock, Image as ImageIcon, Sun, Moon, Check, LogOut, Edit2 } from 'lucide-react';
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

// TODO: Fetch cuisineOptions and restaurantTypes from backend or config instead of hardcoding
const cuisineOptions: { value: string; label: string }[] = [];
const restaurantTypes: { value: string; label: string }[] = [];

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState<{
    restaurantName: string | undefined;
    email: string | undefined;
    description: string | undefined;
    address: string | undefined;
    image: string | undefined;
    servingRadius: number | undefined;
    cuisineTypes: { value: string; label: string }[];
    restaurantType: { value: string; label: string } | undefined;
    phone: string | undefined;
    website: string | undefined;
    gstNumber: string | undefined;
    fssaiNumber: string | undefined;
    banners?: string[];
    hours?: Record<string, { open: string; close: string; isOpen: boolean }>;
    vegNonveg?: string;
  }>({
    restaurantName: undefined,
    email: undefined,
    description: undefined,
    address: undefined,
    image: undefined,
    servingRadius: undefined,
    cuisineTypes: [],
    restaurantType: undefined,
    phone: undefined,
    website: undefined,
    gstNumber: undefined,
    fssaiNumber: undefined
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

  // Helper to normalize restaurant data from backend
  function normalizeRestaurantData(restaurant: any) {
    // Parse cuisines from comma-separated string if needed
    const cuisines = typeof restaurant.cuisines === 'string' 
      ? restaurant.cuisines.split(',').map((c: string) => c.trim())
      : Array.isArray(restaurant.cuisines) 
        ? restaurant.cuisines 
        : [];

    const restaurantTypeObj = restaurant.restaurantType 
      ? { value: restaurant.restaurantType, label: restaurant.restaurantType }
      : undefined;

    return {
      name: restaurant.name || '',
      email: restaurant.email || '',
      description: restaurant.description || '',
      address: typeof restaurant.address === 'object' 
        ? `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} - ${restaurant.address.pincode}`
        : restaurant.address || '',
      image: restaurant.banners?.[0] || '',
      servingRadius: restaurant.servingRadius ?? 0,
      cuisineTypes: cuisines.map((c: string) => ({
        value: c,
        label: c
      })),
      restaurantType: restaurantTypeObj,
      phone: restaurant.mobile || '',
      website: restaurant.website || '',
      gstNumber: restaurant.gstNumber || '',
      fssaiNumber: restaurant.fssaiNumber || '',
      hours: restaurant.hours || null,
      banners: restaurant.banners || [],
      vegNonveg: restaurant.vegNonveg || 'both',
    };
  }

  // Fetch restaurant profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Not authenticated');
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/restaurants/me`, {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (res.ok && data.success) {
          const restaurant = data.data;
          // Parse cuisines from comma-separated string if needed
          const cuisines = typeof restaurant.cuisines === 'string' 
            ? restaurant.cuisines.split(',').map((c: string) => c.trim())
            : Array.isArray(restaurant.cuisines) 
              ? restaurant.cuisines 
              : [];

          // Parse address if it's a string
          let addressStr = '';
          if (typeof restaurant.address === 'object') {
            const { street, city, state, pincode } = restaurant.address;
            addressStr = `${street}, ${city}, ${state} - ${pincode}`;
          } else if (typeof restaurant.address === 'string') {
            addressStr = restaurant.address;
          }

          setProfileData({
            restaurantName: restaurant.name || '',
            email: restaurant.email || '',
            description: restaurant.description || '',
            address: addressStr,
            image: restaurant.banners?.[0] || '',
            servingRadius: restaurant.servingRadius || 0,
            phone: restaurant.mobile || '',
            cuisineTypes: cuisines.map((cuisine: string) => ({
              value: cuisine,
              label: cuisine
            })),
            restaurantType: restaurant.restaurantType ? {
              value: restaurant.restaurantType,
              label: restaurant.restaurantType
            } : undefined,
            vegNonveg: restaurant.vegNonveg || 'both',
            hours: restaurant.hours || {},
            banners: restaurant.banners || [],
            website: restaurant.website || '',
            gstNumber: restaurant.gstNumber || '',
            fssaiNumber: restaurant.fssaiNumber || ''
          });

          if (restaurant.hours) {
            setOperatingHours(restaurant.hours);
          }

          localStorage.setItem('restaurant', JSON.stringify(data.data));
        } else {
          throw new Error(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || 'Failed to load profile');
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // Load profile data from localStorage if user is logged in
  useEffect(() => {
    const restaurant = localStorage.getItem('restaurant');
    if (restaurant) {
      try {
        const data = JSON.parse(restaurant);
        setProfileData({
          restaurantName: data.name,
          email: data.email,
          description: data.description,
          address: data.address,
          image: data.image,
          servingRadius: data.servingRadius,
          cuisineTypes: Array.isArray(data.cuisineTypes || data.cuisineType)
            ? (data.cuisineTypes || data.cuisineType).map((c: string) => cuisineOptions.find(opt => opt.value === c)).filter(Boolean)
            : [],
          restaurantType: restaurantTypes.find(opt => opt.value === data.restaurantType),
          phone: data.mobileNumber || data.phone,
          website: data.website,
          gstNumber: data.gstNumber,
          fssaiNumber: data.fssaiNumber,
        });
        if (data.operatingHours) {
          setOperatingHours(data.operatingHours);
        }
      } catch {}
    }
  }, []); // <-- remove [isEditing], run only once on mount

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const restaurantId = localStorage.getItem('restaurantId');
      if (!token) throw new Error('Not authenticated');
      // Only send allowed fields as per backend (remove password)
      // Parse the current address if it exists
      let addressObj = { street: '', city: '', state: '', pincode: '' };
      if (profileData.address) {
        const parts = profileData.address.split(',').map(p => p.trim());
        addressObj = {
          street: parts[0] || '',
          city: parts[1] || '',
          state: parts[2]?.split('-')[0].trim() || 'Gujarat',
          pincode: parts[2]?.split('-')[1]?.trim() || '380000'
        };
      }

      // Ensure required fields are present
      if (!profileData.address || !profileData.cuisineTypes.length || !operatingHours) {
        throw new Error('Address, cuisines, and operating hours are required');
      }

      const updatePayload: Record<string, any> = {
        name: profileData.restaurantName,
        email: profileData.email,
        mobile: profileData.phone,
        description: profileData.description,
        address: addressObj, // Already in JSON format
        cuisines: profileData.cuisineTypes.map(c => c.value).join(','), // Convert to comma-separated string
        restaurantType: profileData.restaurantType?.value,
        website: profileData.website,
        gstNumber: profileData.gstNumber,
        fssaiNumber: profileData.fssaiNumber,
        hours: operatingHours, // Already in JSON format
        vegNonveg: profileData.vegNonveg || 'both',
        banners: profileData.banners || [], // Required field
      };
      // Remove undefined/null fields
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined || updatePayload[key] === null) {
          delete updatePayload[key];
        }
      });
      // Add console log to confirm update is sent
      console.log('Sending profile update:', updatePayload);
      console.log('Sending JSON:', JSON.stringify(updatePayload));
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurants/updateRestaurant`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success('Profile updated successfully!');
        // Re-fetch the latest profile data from backend
        if (restaurantId) {
          try {
            const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurants/${restaurantId}`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            });
            const profileDataRes = await profileRes.json();
            if (profileRes.ok && profileDataRes.status === 'success' && profileDataRes.data) {
              const normalizedRestaurant = normalizeRestaurantData(profileDataRes.data);
              // Update localStorage with the latest normalized data
              localStorage.setItem('restaurant', JSON.stringify(normalizedRestaurant));
              // Update state directly from normalized data (not from localStorage)
              setProfileData({
                restaurantName: normalizedRestaurant.name,
                email: normalizedRestaurant.email,
                description: normalizedRestaurant.description,
                address: normalizedRestaurant.address,
                image: normalizedRestaurant.image,
                servingRadius: normalizedRestaurant.servingRadius,
                cuisineTypes: Array.isArray(normalizedRestaurant.cuisineTypes)
                  ? normalizedRestaurant.cuisineTypes
                      .map((c: string) => cuisineOptions.find(opt => opt.value === c))
                      .filter((v): v is { value: string; label: string } => Boolean(v))
                  : [],
                restaurantType: normalizedRestaurant.restaurantType,
                phone: normalizedRestaurant.phone,
                website: normalizedRestaurant.website,
                gstNumber: normalizedRestaurant.gstNumber,
                fssaiNumber: normalizedRestaurant.fssaiNumber,
              });
              if (normalizedRestaurant.hours) {
                setOperatingHours(normalizedRestaurant.hours);
              }
            }
          } catch (fetchErr) {
            console.error('Failed to fetch updated profile:', fetchErr);
          }
        }
        setIsEditing(false);
      } else {
        console.error('Update failed. Backend response:', data, 'HTTP status:', res.status);
        toast.error(
          data.detail || data.message || data.error || `Failed to update profile (HTTP ${res.status})`
        );
      }
    } catch (err) {
      console.error('Exception during profile update:', err);
      toast.error(typeof err === 'object' && err !== null && 'message' in err ? (err as any).message : String(err) || 'Failed to update Profile.');
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    // Only clear localStorage and state on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('restaurant');
    localStorage.removeItem('restaurantId');
    setIsEditing(false);
    setIsSaving(false);
    setProfileData({
      restaurantName: undefined,
      email: undefined,
      description: undefined,
      address: undefined,
      image: undefined,
      servingRadius: undefined,
      cuisineTypes: [],
      restaurantType: undefined,
      phone: undefined,
      website: undefined,
      gstNumber: undefined,
      fssaiNumber: undefined,
    });
    setOperatingHours({
      Monday: { ...defaultTimes },
      Tuesday: { ...defaultTimes },
      Wednesday: { ...defaultTimes },
      Thursday: { ...defaultTimes },
      Friday: { ...defaultTimes },
      Saturday: { ...defaultTimes },
      Sunday: { ...defaultTimes }
    });
    if (window.ReactNativeWebView) {
      window.authToken = undefined;
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'LOGOUT' })
      );
    }
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
        className="bg-white rounded-xl shadow-sm p-6 mb-6 relative"
      >
        <div className="flex flex-col items-start gap-4">
          <div className="flex w-full justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profileData.restaurantName}</h1>
              <p className="text-gray-600">Manage your restaurant details and settings</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Logout"
            >
              <LogOut size={24} />
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
              src={profileData.image}
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`text-primary hover:text-primary-dark transition-colors ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSaving}
              title={isEditing ? 'Save Changes' : 'Edit Profile'}
            >
              {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
              <div className="input-group">
                <Store className="input-group-icon" size={20} />
                <input
                  id="restaurantName"
                  type="text"
                  className="input-field"
                  value={profileData.restaurantName || ""}
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
                  value={profileData.email || ""}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="description">Restaurant Description</label>
              <textarea
                id="description"
                className="input-field min-h-[100px]"
                value={profileData.description || ""}
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
                  value={profileData.address || ""}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="servingRadius">Serving Radius (km)</label>
              <div className="input-group">
                <Clock className="input-group-icon" size={20} />
                <input
                  id="servingRadius"
                  type="number"
                  className="input-field"
                  value={profileData.servingRadius ?? ""}
                  min={1}
                  max={100}
                  onChange={e => setProfileData({ ...profileData, servingRadius: Number(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="phone">Phone</label>
              <div className="input-group">
                <input
                  id="phone"
                  type="text"
                  className="input-field"
                  value={profileData.phone || ""}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="website">Website</label>
              <div className="input-group">
                <input
                  id="website"
                  type="text"
                  className="input-field"
                  value={profileData.website || ""}
                  onChange={e => setProfileData({ ...profileData, website: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="gstNumber">GST Number</label>
              <div className="input-group">
                <input
                  id="gstNumber"
                  type="text"
                  className="input-field"
                  value={profileData.gstNumber || ""}
                  onChange={e => setProfileData({ ...profileData, gstNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="fssaiNumber">FSSAI Number</label>
              <div className="input-group">
                <input
                  id="fssaiNumber"
                  type="text"
                  className="input-field"
                  value={profileData.fssaiNumber || ""}
                  onChange={e => setProfileData({ ...profileData, fssaiNumber: e.target.value })}
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
                isDisabled={!isEditing}
                styles={selectStyles as any}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="cuisineTypes">Cuisine Types</label>
              <Select
                id="cuisineTypes"
                options={cuisineOptions}
                value={profileData.cuisineTypes}
                onChange={(value) => setProfileData({ ...profileData, cuisineTypes: value ? [...value] : [] })}
                isMulti
                isDisabled={!isEditing}
                styles={selectStyles as any}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Operating Hours</h2>
            <button
              onClick={() => setIsEditing(prev => !prev)}
              className="text-primary hover:text-primary-dark transition-colors"
              title={isEditing ? 'Save Hours' : 'Edit Hours'}
            >
              {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {Object.keys(operatingHours).map((day, idx) => {
              const { open, close, isOpen } = operatingHours[day];
              return (
                <div key={day} className="flex flex-col">
                  <span className="text-sm text-gray-500">{day}</span>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={open}
                      onChange={e => handleTimeChange(day, 'open', e.target.value)}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                    <input
                      type="time"
                      value={close}
                      onChange={e => handleTimeChange(day, 'close', e.target.value)}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <button
                    onClick={() => toggleDayStatus(day)}
                    disabled={!isEditing}
                    className={`mt-2 px-3 py-1 rounded-md text-sm font-semibold transition-all flex items-center justify-center ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {isOpen ? <Sun size={16} className="mr-1" /> : <Moon size={16} className="mr-1" />}
                    {isOpen ? 'Open' : 'Closed'}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => copyTimesToAll(Object.keys(operatingHours)[0])}
            disabled={!isEditing}
            className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 font-semibold transition-all flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Clock size={16} />
            Copy Monday Hours to All Days
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;