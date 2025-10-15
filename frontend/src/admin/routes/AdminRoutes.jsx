import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../../pages/Dashboard';
import ServicesManagement from '../pages/ServicesManagement';
import ClientsManagement from '../pages/ClientsManagement';
import WebsiteContent from '../../pages/WebsiteContent';
import TestWebsiteContent from '../../pages/TestWebsiteContent';
import SimpleWebsiteContent from '../../pages/SimpleWebsiteContent';
import CareersManagement from '../pages/CareersManagement';
import GalleryManagement from '../pages/GalleryManagement';
import EnquiriesManagement from '../pages/EnquiriesManagement';
import ContractsManagement from '../pages/ContractsManagement';
import Settings from '../pages/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Admin Routes - These should match without /admin prefix */}
      <Route path="/" element={<AdminLogin />} />
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/dashboard" element={
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      } />
      
      <Route path="/content" element={
        <AdminLayout>
          <WebsiteContent />
        </AdminLayout>
      } />
      
      <Route path="/website-content" element={
        <AdminLayout>
          <WebsiteContent />
        </AdminLayout>
      } />
      
      <Route path="/test-content" element={<TestWebsiteContent />} />
      
      <Route path="/content-direct" element={<WebsiteContent />} />
      
      <Route path="/simple-content" element={<SimpleWebsiteContent />} />
      
      <Route path="/services" element={
        <AdminLayout>
          <ServicesManagement />
        </AdminLayout>
      } />
      
      <Route path="/clients" element={
        <AdminLayout>
          <ClientsManagement />
        </AdminLayout>
      } />
      
      <Route path="/contracts" element={
        <AdminLayout>
          <ContractsManagement />
        </AdminLayout>
      } />
      
      <Route path="/careers" element={
        <AdminLayout>
          <CareersManagement />
        </AdminLayout>
      } />
      
      <Route path="/gallery" element={
        <AdminLayout>
          <GalleryManagement />
        </AdminLayout>
      } />
      
      <Route path="/enquiries" element={
        <AdminLayout>
          <EnquiriesManagement />
        </AdminLayout>
      } />
      
      <Route path="/settings" element={
        <AdminLayout>
          <Settings />
        </AdminLayout>
      } />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/admin-login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
