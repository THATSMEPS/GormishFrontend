import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ApprovalPending from './pages/ApprovalPending';

// Custom hook to handle WebView communication
const useWebViewMessage = (message: any) => {
  React.useEffect(() => {
    // Check if we're in a WebView
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, [message]);
};

function App() {
  // Example of WebView communication
  useWebViewMessage({ type: 'APP_READY' });

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          // Adjusted styling for mobile
          style: {
            maxWidth: '90vw',
            margin: '0 auto'
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/approval-pending" element={<ApprovalPending />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;