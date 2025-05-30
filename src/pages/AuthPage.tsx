import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, MapPin, Phone, Pencil, Radius } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('authToken');
    return saved ? saved : null; // Use as plain string, do not JSON.parse
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout state
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
      const response = await fetch(`${API_BASE_URL}/restaurants/loginRestaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });
      const data = await response.json();
      if (response.ok && (data.success || data.status === 'success')) {
        // Accept token if present, but not required for your backend
        if (data.idToken || data.token) {
          setToken(data.idToken || data.token);
          localStorage.setItem('authToken', String(data.idToken || data.token)); // Store as plain string, not JSON
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: 'LOGIN', token: data.idToken || data.token })
          );
        }
        setIsLoggedIn(true);
        // Store restaurantId from backend response if present
        if (data.restaurantId) {
          localStorage.setItem('restaurantId', data.restaurantId);
          const restaurant = await fetch(`${API_BASE_URL}/restaurants/${data.restaurantId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const restaurantData = await restaurant.json();
          if (restaurantData && restaurantData.data) {
            localStorage.setItem('restaurant', JSON.stringify(restaurantData.data));
          } else {
            localStorage.setItem('restaurant', JSON.stringify(restaurantData));
          }
        }
        toast.success('Logged in successfully!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(data.detail || data.message || data.error?.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
      console.error('[AuthPage] Login error:', err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !signupEmail || !signupPassword || !mobileNumber || !address || !servingRadius) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/createNewRestaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantName,
          email: signupEmail,
          password: signupPassword,
          mobileNumber: mobileNumber,
          address: address,
          servingRadius: Number(servingRadius),
          foodItems: [] // Required by backend, can be empty for signup
        }),
      });
      const data = await response.json();
      if (response.ok && (data.success || data.status === 'success')) {
        // Store restaurantId from backend response if present
        const restaurantId = data.restaurantId || (data.data && data.data._id);
        if (restaurantId) {
          localStorage.setItem('restaurantId', restaurantId);
          // Fetch and store restaurant details after signup
          try {
            const restaurantRes = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            if (restaurantRes.ok) {
              const restaurantData = await restaurantRes.json();
              if (restaurantData && restaurantData.data) {
                localStorage.setItem('restaurant', JSON.stringify(restaurantData.data));
              } else {
                localStorage.setItem('restaurant', JSON.stringify(restaurantData));
              }
            }
          } catch (fetchErr) {
            console.error('[AuthPage] Failed to fetch restaurant details after signup:', fetchErr);
          }
        }
        toast.success('Signed up successfully!');
        setIsLoggedIn(true);
        setToken(data.idToken || data.token || null);
        // Store token in localStorage immediately for consistency
        if (data.idToken || data.token) {
          localStorage.setItem('authToken', String(data.idToken || data.token)); // Store as plain string, not JSON
        }
        setIsLogin(true);
        setEmail(signupEmail);
        setPassword(signupPassword);
        setRestaurantName('');
        setSignupEmail('');
        setSignupPassword('');
        setMobileNumber('');
        setAddress('');
        setServingRadius('');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(data.detail || data.message || 'Signup failed');
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

  console.log('[AuthPage] Rendering with isLoggedIn:', isLoggedIn, 'token:', token, 'isLoggingOut:', isLoggingOut);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
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

      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
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
                <button onClick={handleLogout} className="btn-primary w-full group">
                  <span>Logout</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            ) : isLogin ? (
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
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <div className="input-group">
                      <Mail className="input-group-icon" size={20} />
                      <input
                        id="email"
                        type="email"
                        className="input-field"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group">
                      <Lock className="input-group-icon" size={20} />
                      <input
                        id="password"
                        type="password"
                        className="input-field"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full group">
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
                  <p className="text-gray-600 mt-2">Create an account to get started</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
                    <div className="input-group">
                      <Pencil className="input-group-icon" size={20} />

                      <input
                        id="restaurantName"
                        type="text"
                        className="input-field"
                        placeholder="Enter your Restaurant name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="signupEmail">Email Address</label>
                    <div className="input-group">
                      <Mail className="input-group-icon" size={20} />
                      <input
                        id="signupEmail"
                        type="email"
                        className="input-field"
                        placeholder="Enter your email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="signupPassword">Password</label>
                    <div className="input-group">
                      <Lock className="input-group-icon" size={20} />
                      <input
                        id="signupPassword"
                        type="password"
                        className="input-field"
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
                    <div className="input-group">
                      <Phone className="input-group-icon" size={20} />
                      <input
                        id="mobileNumber"
                        type="tel"
                        className="input-field"
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="address">Address</label>
                    <div className="input-group">
                      <MapPin className="input-group-icon" size={20} />
                      <input
                        id="address"
                        type="text"
                        className="input-field"
                        placeholder="Enter your Restaurant's Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="servingRadius">Serving Radius</label>
                    <div className="input-group">
                      <Radius className="input-group-icon" size={20} />
                      <input
                        id="servingRadius"
                        type="text"
                        className="input-field"
                        placeholder="Enter your serving radius in km"
                        value={servingRadius}
                        onChange={(e) => setServingRadius(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  
                </div>

                <button type="submit" className="btn-primary w-full group">
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
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
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;