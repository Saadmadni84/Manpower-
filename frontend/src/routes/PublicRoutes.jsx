import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Services from '../pages/Services';
import Clients from '../pages/Clients';
import Careers from '../pages/Careers';
import Gallery from '../pages/Gallery/Gallery';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      {/* Add more public routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;

