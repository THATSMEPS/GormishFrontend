import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layouts/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import Button from '../components/ui/Button';

// Add these types at the top of the file
declare global {
  interface Window {
    authToken?: string;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://99ce-138-199-21-196.ngrok-free.app';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [servingRadius, setServingRadius] = useState('');
  const [cuisines, setCuisines] = useState<{ value: string; label: string }[]>([]);
  const [vegNonVeg, setVegNonVeg] = useState<string>('both');
  const [banners, setBanners] = useState<string[]>([]);
  const [hours, setHours] = useState<Record<string, { open: string; close: string; isOpen: boolean }>>({
    Monday: { open: "09:00", close: "22:00", isOpen: true },
    Tuesday: { open: "09:00", close: "22:00", isOpen: true },
    Wednesday: { open: "09:00", close: "22:00", isOpen: true },
    Thursday: { open: "09:00", close: "22:00", isOpen: true },
    Friday: { open: "09:00", close: "22:00", isOpen: true },
    Saturday: { open: "09:00", close: "22:00", isOpen: true },
    Sunday: { open: "09:00", close: "22:00", isOpen: true }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('authToken');
    return saved ? saved : null;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Persist state to localStorage
  useEffect(() => {
    if (!isLoggingOut) {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      if (token) {
        localStorage.setItem('authToken', token); // Store as plain string
      } else {
        localStorage.removeItem('authToken');
      }
      console.log('[AuthPage] Persisted state to localStorage:', { isLoggedIn, token });
    }
  }, [isLoggedIn, token, isLoggingOut]);

  // Handle auto-login with injected token
  useEffect(() => {
    console.log('[AuthPage] Component mounted');

    const handleAuthToken = () => {
      console.log('[AuthPage] handleAuthToken called');
      const storedToken = window.authToken;
      console.log('[AuthPage] Received injected token for auto-login:', storedToken);
      if (isLoggingOut) {
        console.log('[AuthPage] Skipping auto-login due to logout in progress');
        // Always navigate to login page if logging out
        navigate('/', { replace: true });
        return;
      }
      if (storedToken && !isLoggedIn) {
        setToken(storedToken);
        setIsLoggedIn(true);
        toast.success('Auto-logged in successfully!');
        console.log('[AuthPage] Navigating to /dashboard from handleAuthToken');
        navigate('/dashboard', { replace: true });
      } else if (!storedToken) {
        console.log('[AuthPage] No token found for auto-login');
      } else {
        console.log('[AuthPage] Already logged in, skipping auto-login');
      }
    };

    if (window.authToken) {
      console.log('[AuthPage] Token found on mount:', window.authToken);
      handleAuthToken();
    }

    console.log('[AuthPage] Adding event listener for authTokenReady');
    window.addEventListener('authTokenReady', handleAuthToken);

    return () => {
      console.log('[AuthPage] Cleaning up');
      window.removeEventListener('authTokenReady', handleAuthToken);
    };
  }, [navigate, isLoggedIn, isLoggingOut]);

  // Ensure navigation to dashboard if already logged in, but not during logout
  useEffect(() => {
    console.log('[AuthPage] isLoggedIn state updated:', isLoggedIn);
    if (isLoggingOut) {
      // Always go to login page if logging out
      navigate('/', { replace: true });
      return;
    }
    if (isLoggedIn) {
      console.log('[AuthPage] isLoggedIn is true, ensuring navigation to /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate, isLoggingOut]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      console.log('[AuthPage] Login failed: Email or password missing');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('authToken', data.token);
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: 'LOGIN', token: data.token })
          );
        }

        // Get the restaurant profile
        const restaurantRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/restaurants/me`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        const restaurantData = await restaurantRes.json();
        
        if (restaurantRes.ok && restaurantData.success) {
          localStorage.setItem('restaurantId', restaurantData.data.id);
          localStorage.setItem('restaurant', JSON.stringify(restaurantData.data));
          
          setIsLoggedIn(true);
          toast.success('Logged in successfully!');
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Failed to fetch restaurant profile');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
      console.error('[AuthPage] Login error:', err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !signupEmail || !signupPassword || !mobileNumber || !address) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantName,
          email: signupEmail,
          password: signupPassword,
          mobile: mobileNumber,
          address: {
            street: address,
            city: "Ahmedabad",
            state: "Gujarat",
            pincode: "380000"
          },
          cuisines: cuisines.map(c => c.value).join(','),
          vegNonveg: vegNonVeg,
          hours: hours,
          banners: banners.length > 0 ? banners : ["https://placehold.co/600x400"]
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: 'LOGIN', token: data.token })
        );
        // Always fetch the latest profile from backend after signup
        const restaurantRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/restaurants/me`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        const restaurantData = await restaurantRes.json();
        if (restaurantRes.ok && restaurantData.success) {
          localStorage.setItem('restaurantId', restaurantData.data.id);
          localStorage.setItem('restaurant', JSON.stringify(restaurantData.data));
        } else {
          throw new Error('Failed to fetch restaurant profile after signup');
        }
        toast.success('Signed up successfully!');
        setIsLoggedIn(true);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
      console.error('[AuthPage] Signup error:', err);
    }
  };

  const handleLogout = () => {
    // Set logout state to prevent auto-login
    setIsLoggingOut(true);

    // Clear local state
    setToken(null);
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');

    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    console.log('[AuthPage] Cleared localStorage entries for session termination');

    // Clear window.authToken to prevent auto-login after WebView reload
    window.authToken = undefined;
    console.log('[AuthPage] Cleared window.authToken to prevent auto-login');

    // Send LOGOUT message to native app
    console.log('[AuthPage] Sending LOGOUT message to native app');
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'LOGOUT' })
    );

    toast.success('Logged out successfully!');
    navigate('/', { replace: true });
  };

  const handleLoginFormChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  const handleSignupFormChange = (field: string, value: any) => {
    switch (field) {
      case 'restaurantName': setRestaurantName(value); break;
      case 'signupEmail': setSignupEmail(value); break;
      case 'signupPassword': setSignupPassword(value); break;
      case 'mobileNumber': setMobileNumber(value); break;
      case 'address': setAddress(value); break;
      case 'servingRadius': setServingRadius(value); break;
      case 'cuisines': setCuisines(value); break;
      case 'vegNonVeg': setVegNonVeg(value); break;
      case 'banners': setBanners(value); break;
      case 'hours': setHours(value); break;
    }
  };

  console.log('[AuthPage] Rendering with isLoggedIn:', isLoggedIn, 'token:', token, 'isLoggingOut:', isLoggingOut);
  return (
    <AuthLayout
      title={isLogin ? 'Welcome Back!' : 'Join Our Network'}
      description={isLogin
        ? 'Access your restaurant dashboard and manage orders efficiently.'
        : 'Partner with us to grow your restaurant business and reach more customers.'}
    >
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="logged-in"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
            <p className="text-gray-600">You are logged in with token: {token}</p>
            <Button
              onClick={handleLogout}
              variant="primary"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            >
              Logout
            </Button>
          </motion.div>
        ) : isLogin ? (
          <LoginForm
            email={email}
            password={password}
            onSubmit={handleLogin}
            onChange={handleLoginFormChange}
          />
        ) : (
          <SignupForm
            restaurantName={restaurantName}
            signupEmail={signupEmail}
            signupPassword={signupPassword}
            mobileNumber={mobileNumber}
            address={address}
            servingRadius={servingRadius}
            cuisines={cuisines}
            vegNonVeg={vegNonVeg}
            banners={banners}
            hours={hours}
            onSubmit={handleSignup}
            onChange={handleSignupFormChange}
          />
        )}
      </AnimatePresence>

      {!isLoggedIn && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-primary font-medium hover:underline text-center w-full"
        >
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </motion.button>
      )}
    </AuthLayout>
  );
};

export default AuthPage;