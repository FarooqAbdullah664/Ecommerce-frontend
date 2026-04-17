import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Toolbar, Divider, Avatar, Button
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const DRAWER_WIDTH = 240;

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/admin" },
    { label: "Products", icon: <InventoryIcon />, to: "/admin/products" },
    { label: "Orders", icon: <ShoppingBagIcon />, to: "/admin/orders" },
    { label: "Users", icon: <PeopleIcon />, to: "/admin/users" },
    { label: "Cards", icon: <CreditCardIcon />, to: "/admin/cards" },
];

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) navigate("/login");
    }, [user, loading]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Drawer variant="permanent" sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH, bgcolor: "#0f172a", color: "white",
                    boxSizing: "border-box", borderRight: "none"
                }
            }}>
                {/* Logo */}
                <Box sx={{ p: 3, borderBottom: "1px solid #1e293b" }}>
                    <Typography variant="h6" sx={{ color: "#38bdf8", fontWeight: "bold" }}>
                        🛍️ ShopZone
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>Admin Panel</Typography>
                </Box>

                {/* User Info */}
                {user && (
                    <Box sx={{ p: 2, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "#6366f1", fontSize: 14 }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold" color="white">{user.name}</Typography>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>Administrator</Typography>
                        </Box>
                    </Box>
                )}

                {/* Nav Items */}
                <List sx={{ px: 1, pt: 2, flexGrow: 1 }}>
                    {navItems.map((item) => {
                        const active = location.pathname === item.to ||
                            (item.to !== "/admin" && location.pathname.startsWith(item.to));
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton component={Link} to={item.to}
                                    sx={{
                                        borderRadius: 2, color: active ? "white" : "#94a3b8",
                                        bgcolor: active ? "#1e3a5f" : "transparent",
                                        "&:hover": { bgcolor: "#1e293b", color: "white" }
                                    }}>
                                    <ListItemIcon sx={{ color: active ? "#38bdf8" : "#64748b", minWidth: 38 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label}
                                        primaryTypographyProps={{ fontWeight: active ? 700 : 400 }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: "#1e293b" }} />

                {/* Bottom Buttons */}
                <Box sx={{ p: 1, pb: 2 }}>
                    <ListItemButton component={Link} to="/"
                        sx={{ borderRadius: 2, color: "#94a3b8", "&:hover": { bgcolor: "#1e293b", color: "white" } }}>
                        <ListItemIcon sx={{ color: "#64748b", minWidth: 38 }}><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Back to Store" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}
                        sx={{ borderRadius: 2, color: "#f87171", "&:hover": { bgcolor: "#1e293b" } }}>
                        <ListItemIcon sx={{ color: "#f87171", minWidth: 38 }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
                <Outlet />
            </Box>
        </Box>
    );
}
