import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import AdminLogin from '../pages/AdminLogin';
import SimpleLogin from '../pages/SimpleLogin';
import BasicTest from '../pages/BasicTest';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import ContentManagement from '../pages/Content/ContentManagement';
import ServicesManagement from '../pages/Services/ServicesManagement';
import ClientsManagement from '../pages/Clients/ClientsManagement';
import ContractsManagement from '../pages/Contracts/ContractsManagement';
import CareersManagement from '../pages/Careers/CareersManagement';
import GalleryManagement from '../pages/Gallery/GalleryManagement';
import EnquiriesManagement from '../pages/Enquiries/EnquiriesManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Admin Routes */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin-login" element={<BasicTest />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Admin Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/content" element={<ContentManagement />} />
                <Route path="/services" element={<ServicesManagement />} />
                <Route path="/clients" element={<ClientsManagement />} />
                <Route path="/contracts" element={<ContractsManagement />} />
                <Route path="/careers" element={<CareersManagement />} />
                <Route path="/gallery" element={<GalleryManagement />} />
                <Route path="/enquiries" element={<EnquiriesManagement />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
