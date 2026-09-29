import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            style: {
                                background: '#FFFFFF',
                                color: '#3B2A20',
                                border: '1px solid #EADFCF',
                                boxShadow: '0 10px 30px -12px rgba(59,42,32,0.25)',
                                fontWeight: 500,
                            },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </HashRouter>
    </StrictMode>
);
