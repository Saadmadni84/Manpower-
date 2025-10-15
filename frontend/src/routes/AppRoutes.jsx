import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import { GalleryProvider } from '../context/GalleryContext';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from '../admin/routes/AdminRoutes';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <GalleryProvider>
              <Routes>
                <Route path="/admin-login" element={<AdminRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<PublicRoutes />} />
              </Routes>
            </GalleryProvider>
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AppRoutes;

