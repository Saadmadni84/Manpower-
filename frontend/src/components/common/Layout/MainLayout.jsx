import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

