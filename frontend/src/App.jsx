import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import { LanguageProvider } from './context/LanguageContext';
import './config/language';
import './styles/variables.css';
import './styles/globals.css';
import './styles/rtl.css';
import AppRoutes from './routes/AppRoutes';
import CursorAnimation from './components/ui/CursorAnimation/CursorAnimation';
import FloatingAction from './components/ui/FloatingAction/FloatingAction';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
        <CursorAnimation />
        <FloatingAction />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

