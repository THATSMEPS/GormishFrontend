import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Store, MapPin, Clock, Image as ImageIcon, ChevronDown, Lock, ArrowRight, User, Check, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';

// Custom styles for react-select
const selectStyles = {
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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<any[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const navigate = useNavigate();

  const defaultTimes = {
    open: '09:00',
    close: '22:00',
    isOpen: true
  };

  const [operatingHours, setOperatingHours] = useState({
    Monday: { ...defaultTimes },
    Tuesday: { ...defaultTimes },
    Wednesday: { ...defaultTimes },
    Thursday: { ...defaultTimes },
    Friday: { ...defaultTimes },
    Saturday: { ...defaultTimes },
    Sunday: { ...defaultTimes }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOTP) {
      if (phone.length === 10) {
        setShowOTP(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Please enter a valid phone number');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/approval-pending');
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [type]: value
      }
    }));
  };

  const toggleDayStatus = (day: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        isOpen: !prev[day as keyof typeof prev].isOpen
      }
    }));
  };

  const copyTimesToAll = (fromDay: string) => {
    const sourceTime = operatingHours[fromDay as keyof typeof operatingHours];
    setOperatingHours(prev => {
      const newHours = { ...prev };
      Object.keys(newHours).forEach(day => {
        if (day !== fromDay) {
          newHours[day as keyof typeof operatingHours] = { ...sourceTime };
        }
      });
      return newHours;
    });
    toast.success('Operating hours copied to all days');
  };

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } else {
      toast.error('Please enter a valid phone number');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setPhoneVerified(true);
      toast.success('Phone number verified successfully!');
    } else {
      toast.error('Please enter a valid OTP');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Image & Content */}
      <div className="h-64 md:h-auto md:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
            alt="Restaurant Ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Our Network'}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-md">
              {isLogin
                ? 'Access your restaurant dashboard and manage orders efficiently.'
                : 'Partner with us to grow your restaurant business and reach more customers.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Login to Dashboard</h2>
                  <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="form-label" htmlFor="loginPhone">Phone Number</label>
                    <div className="input-group">
                      <Phone className="input-group-icon" size={20} />
                      <input
                        id="loginPhone"
                        type="tel"
                        className="input-field"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  {showOTP && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="form-label" htmlFor="otp">OTP Verification</label>
                      <div className="input-group">
                        <Lock className="input-group-icon" size={20} />
                        <input
                          id="otp"
                          type="text"
                          className="input-field tracking-[0.5em] text-center font-mono"
                          placeholder="• • • • • •"
                          maxLength={6}
                          pattern="[0-9]{6}"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full group">
                  <span>{showOTP ? 'Verify & Login' : 'Send OTP'}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Register Your Restaurant</h2>
                  <p className="text-gray-600 mt-2">Fill in the details to get started</p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="ownerName">Owner Name</label>
                      <input
                        id="ownerName"
                        type="text"
                        className="input-field"
                        placeholder="Enter owner's name"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
                      <div className="input-group">
                        <Store className="input-group-icon" size={20} />
                        <input
                          id="restaurantName"
                          type="text"
                          className="input-field"
                          placeholder="Enter restaurant name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <div className="relative">
                        <div className="input-group">
                          <Phone className="input-group-icon" size={20} />
                          <input
                            id="phone"
                            type="tel"
                            className="input-field"
                            placeholder="Enter phone number"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            required
                            disabled={phoneVerified}
                          />
                        </div>
                        {!otpSent && !phoneVerified && (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-md text-sm"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && !phoneVerified && (
                      <div>
                        <label className="form-label" htmlFor="otp">Enter OTP</label>
                        <div className="relative">
                          <div className="input-group">
                            <Lock className="input-group-icon" size={20} />
                            <input
                              id="otp"
                              type="text"
                              className="input-field tracking-[0.5em] text-center font-mono"
                              placeholder="• • • • • •"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-md text-sm"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <div className="input-group">
                        <Mail className="input-group-icon" size={20} />
                        <input
                          id="email"
                          type="email"
                          className="input-field"
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="address">Restaurant Address</label>
                    <div className="input-group">
                      <MapPin className="input-group-icon" size={20} />
                      <textarea
                        id="address"
                        className="input-field min-h-[100px]"
                        placeholder="Enter complete restaurant address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="area">Service Area</label>
                    <Select
                      id="area"
                      options={areaOptions}
                      value={selectedArea}
                      onChange={setSelectedArea}
                      styles={selectStyles}
                      placeholder="Select service area"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="cuisines">Cuisine Types</label>
                    <Select
                      id="cuisines"
                      isMulti
                      options={cuisineOptions}
                      value={selectedCuisines}
                      onChange={setSelectedCuisines}
                      styles={selectStyles}
                      placeholder="Search and select cuisines"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">You can select multiple cuisines</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Operating Hours
                    </h3>
                    <button
                      type="button"
                      onClick={() => copyTimesToAll('Monday')}
                      className="text-sm text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Check size={16} />
                      Copy Monday's hours to all days
                    </button>
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
                          <button
                            type="button"
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
                                required={times.isOpen}
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
                                required={times.isOpen}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full group">
                  <span>Submit Registration</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsLogin(!isLogin);
              setCurrentStep(1);
            }}
            className="mt-6 text-primary font-medium hover:underline text-center w-full"
          >
            {isLogin ? 'Register Your Restaurant Now!' : 'Already have an account? Login'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;