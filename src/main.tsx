import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './shared/index.css';
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </>
);


