import { Routes, Route } from 'react-router-dom';
import Home from '../Home/Home';
import LoginForm from '../login/login';
import SignupForm from '../SignUp/SignUp';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import MyOrders from '../pages/MyOrders';
import Profile from '../pages/Profile';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminProducts from '../admin/AdminProducts';
import AdminOrders from '../admin/AdminOrders';
import AdminUsers from '../admin/AdminUsers';
import AdminCards from '../admin/AdminCards';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth Required */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="cards" element={<AdminCards />} />
            </Route>
        </Routes>
    );
}
