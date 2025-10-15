import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StandaloneLogin from '../pages/StandaloneLogin';
import SaudiAdminLayout from '../components/SaudiAdminLayout';
import EnhancedDashboard from '../pages/EnhancedDashboard';
import CompleteContent from '../pages/CompleteContent';
import CompleteServices from '../pages/CompleteServices';
import CompleteClients from '../pages/CompleteClients';
import CompleteContracts from '../pages/CompleteContracts';
import CompleteCareers from '../pages/CompleteCareers';
import CompleteGallery from '../pages/CompleteGallery';
import CompleteEnquiries from '../pages/CompleteEnquiries';

const CompleteAdminRoutes = () => {
  console.log('CompleteAdminRoutes is rendering');
  
  return (
    <div>
      <Routes>
        <Route path="/admin-login" element={<StandaloneLogin />} />
        <Route path="/dashboard" element={
          <SaudiAdminLayout>
            <EnhancedDashboard />
          </SaudiAdminLayout>
        } />
        <Route path="/content" element={
          <SaudiAdminLayout>
            <CompleteContent />
          </SaudiAdminLayout>
        } />
        <Route path="/services" element={
          <SaudiAdminLayout>
            <CompleteServices />
          </SaudiAdminLayout>
        } />
        <Route path="/clients" element={
          <SaudiAdminLayout>
            <CompleteClients />
          </SaudiAdminLayout>
        } />
        <Route path="/contracts" element={
          <SaudiAdminLayout>
            <CompleteContracts />
          </SaudiAdminLayout>
        } />
        <Route path="/careers" element={
          <SaudiAdminLayout>
            <CompleteCareers />
          </SaudiAdminLayout>
        } />
        <Route path="/gallery" element={
          <SaudiAdminLayout>
            <CompleteGallery />
          </SaudiAdminLayout>
        } />
        <Route path="/enquiries" element={
          <SaudiAdminLayout>
            <CompleteEnquiries />
          </SaudiAdminLayout>
        } />
        <Route path="/*" element={
          <SaudiAdminLayout>
            <EnhancedDashboard />
          </SaudiAdminLayout>
        } />
      </Routes>
    </div>
  );
};

export default CompleteAdminRoutes;
