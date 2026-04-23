import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Show loading screen for 2.2 seconds
        const timer = setTimeout(() => setLoading(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingScreen />;

    return (
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Root />
    </StrictMode>
);
