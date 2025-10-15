import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StandaloneLogin from '../pages/StandaloneLogin';

const StandaloneAdminRoutes = () => {
  console.log('StandaloneAdminRoutes is rendering');
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<StandaloneLogin />} />
        <Route path="*" element={<StandaloneLogin />} />
      </Routes>
    </div>
  );
};

export default StandaloneAdminRoutes;
