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
                                background: '#1a1a24',
                                color: '#f5f5f7',
                                border: '1px solid rgba(255,107,53,0.3)',
                                fontWeight: 500,
                            },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </HashRouter>
    </StrictMode>
);
