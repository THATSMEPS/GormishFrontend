import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Orders from '../components/Orders';
import Profile from './Profile';
import Analytics from './Analytics';
import MenuPage from './Menu';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;