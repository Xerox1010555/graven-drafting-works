/**
 * GRAVEN - Main App Component
 * Routing, providers, and global layout
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { Index, Work, Method, Studio, Contact, NotFound } from './pages/pages';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider maxToasts={5} position="top-right">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/method" element={<Method />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;