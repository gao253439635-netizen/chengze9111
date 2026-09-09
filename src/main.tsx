import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminPage from './admin/AdminPage.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { SiteConfigProvider } from './config/SiteConfigContext';
import { MagnetProvider } from './context/MagnetContext';
import './index.css';

const path = window.location.pathname;
const isAdmin = path.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SiteConfigProvider>
        <MagnetProvider>
          {isAdmin ? <AdminPage /> : <App />}
        </MagnetProvider>
      </SiteConfigProvider>
    </LanguageProvider>
  </StrictMode>,
);
