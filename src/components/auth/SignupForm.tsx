import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Pencil, MapPin, Phone, Radius, ArrowRight } from 'lucide-react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import CuisineSelector from '../ui/CuisineSelector';
import VegNonVegSelector from '../ui/VegNonVegSelector';
import BannersInput from '../ui/BannersInput';
import OperatingHoursInput from '../ui/OperatingHoursInput';

interface SignupFormProps {
  restaurantName: string;
  signupEmail: string;
  signupPassword: string;
  mobileNumber: string;
  address: string;
  servingRadius: string;
  cuisines: { value: string; label: string }[];
  vegNonVeg: string;
  banners: string[];
  hours: Record<string, { open: string; close: string; isOpen: boolean }>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  restaurantName,
  signupEmail,
  signupPassword,
  mobileNumber,
  address,
  servingRadius,
  cuisines,
  vegNonVeg,
  banners,
  hours,
  onSubmit,
  onChange,
}) => {
  return (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-gray-600 mt-2">Create an account to get started</p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Restaurant Name"
          id="restaurantName"
          type="text"
          placeholder="Enter your Restaurant name"
          value={restaurantName}
          onChange={(e) => onChange('restaurantName', e.target.value)}
          required
          icon={<Pencil size={20} />}
        />

        <InputField
          label="Email Address"
          id="signupEmail"
          type="email"
          placeholder="Enter your email"
          value={signupEmail}
          onChange={(e) => onChange('signupEmail', e.target.value)}
          required
          icon={<Mail size={20} />}
        />

        <InputField
          label="Password"
          id="signupPassword"
          type="password"
          placeholder="Create a password"
          value={signupPassword}
          onChange={(e) => onChange('signupPassword', e.target.value)}
          required
          icon={<Lock size={20} />}
        />

        <InputField
          label="Mobile Number"
          id="mobileNumber"
          type="tel"
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChange={(e) => onChange('mobileNumber', e.target.value)}
          required
          icon={<Phone size={20} />}
        />

        <InputField
          label="Address"
          id="address"
          placeholder="Enter your Restaurant's Address"
          value={address}
          onChange={(e) => onChange('address', e.target.value)}
          required
          multiline
          icon={<MapPin size={20} />}
        />

        <InputField
          label="Serving Radius"
          id="servingRadius"
          type="text"
          placeholder="Enter your serving radius in km"
          value={servingRadius}
          onChange={(e) => onChange('servingRadius', e.target.value)}
          required
          icon={<Radius size={20} />}
        />

        <CuisineSelector
          selectedCuisines={cuisines}
          onChange={(value: { value: string; label: string }[]) => onChange('cuisines', value)}
        />

        <VegNonVegSelector
          selectedOption={vegNonVeg}
          onChange={(value: string) => onChange('vegNonVeg', value)}
        />

        <BannersInput
          banners={banners}
          onChange={(value: string[]) => onChange('banners', value)}
        />

        <OperatingHoursInput
          hours={hours}
          onChange={(value: Record<string, { open: string; close: string; isOpen: boolean }>) => onChange('hours', value)}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth rightIcon={<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}>
        Sign Up
      </Button>
    </motion.form>
  );
};

export default SignupForm;
