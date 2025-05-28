import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for injected token from the native app to auto-login
  useEffect(() => {
    const handleAuthToken = () => {
      // @ts-ignore
      const storedToken = window.authToken;
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
        toast.success('Auto-logged in successfully!');
        navigate('/dashboard'); // Navigate to dashboard on auto-login
      }
    };

    window.addEventListener('authTokenReady', handleAuthToken);
    return () => window.removeEventListener('authTokenReady', handleAuthToken);
  }, [navigate]);

  // Handle login with email and password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Simulate token generation (replace with actual API call in production)
    const newToken = 'example-token-' + email; // Simulated token
    setToken(newToken);
    setIsLoggedIn(true);

    // Send the token to the native app via postMessage
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'LOGIN', token: newToken })
    );

    toast.success('Logged in successfully!');
    navigate('/dashboard');
  };

  // Handle signup with email and password
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Simulate token generation (replace with actual API call in production)
    const newToken = 'example-token-' + email; // Simulated token
    setToken(newToken);
    setIsLoggedIn(true);

    // Send the token to the native app via postMessage
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'LOGIN', token: newToken })
    );

    toast.success('Signed up successfully!');
    navigate('/dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');

    // Clear the token in the native app
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'LOGOUT' })
    );

    toast.success('Logged out successfully!');
    navigate('/');
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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