
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Typography, Divider, Avatar, Chip, IconButton, AppBar, Toolbar
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const DRAWER_WIDTH = 250;
const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/admin" },
    { label: "Products", icon: <InventoryIcon />, to: "/admin/products" },
    { label: "Orders", icon: <ShoppingBagIcon />, to: "/admin/orders" },
    { label: "Users", icon: <PeopleIcon />, to: "/admin/users" },
    { label: "Cards", icon: <CreditCardIcon />, to: "/admin/cards" },
];

function SidebarContent({ user, location, handleLogout, onClose }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#1B2B4B" }}>
            {/* Logo */}
            <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h6" fontWeight={800} color="white">
                        Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>Admin Panel</Typography>
                </Box>
                {onClose && (
                    <IconButton onClick={onClose} sx={{ color: "white", display: { md: "none" } }}>
                        <CloseRoundedIcon />
                    </IconButton>
                )}
            </Box>

            {/* User */}
            {user && (
                <Box sx={{ p: 2.5, mx: 1.5, my: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: "#FF6B6B", fontWeight: 700, fontSize: 15 }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={700} color="white">{user.name}</Typography>
                            <Chip label="Admin" size="small" sx={{ height: 16, fontSize: 10, fontWeight: 700, bgcolor: "rgba(255,107,107,0.2)", color: "#FF6B6B", mt: 0.3 }} />
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Nav */}
            <List sx={{ px: 1.5, flexGrow: 1 }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
                    return (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link} to={item.to}
                                onClick={onClose}
                                sx={{
                                    borderRadius: 2.5, py: 1.2,
                                    bgcolor: active ? "rgba(255,107,107,0.15)" : "transparent",
                                    border: active ? "1px solid rgba(255,107,107,0.2)" : "1px solid transparent",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                                    transition: "all 0.2s"
                                }}>
                                <ListItemIcon sx={{ minWidth: 38, color: active ? "#FF6B6B" : "#64748b", "& svg": { fontSize: 20 } }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontWeight: active ? 700 : 500, color: active ? "white" : "#94a3b8", fontSize: "0.88rem" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, mb: 1 }} />

            <List sx={{ px: 1.5, pb: 2 }}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton component={Link} to="/" onClick={onClose} sx={{ borderRadius: 2.5, py: 1.2, "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}>
                        <ListItemIcon sx={{ minWidth: 38, color: "#64748b", "& svg": { fontSize: 20 } }}><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Back to Store" primaryTypographyProps={{ fontWeight: 500, color: "#94a3b8", fontSize: "0.88rem" }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2.5, py: 1.2, "&:hover": { bgcolor: "rgba(255,107,107,0.1)" } }}>
                        <ListItemIcon sx={{ minWidth: 38, color: "#FF6B6B", "& svg": { fontSize: 20 } }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: "#FF6B6B", fontSize: "0.88rem" }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) navigate("/login");
    }, [user, loading]);

    const handleLogout = async () => { await logout(); navigate("/login"); };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>

            {/* Mobile Top AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    display: { md: "none" },
                    bgcolor: "#1B2B4B",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    zIndex: 1300
                }}>
                <Toolbar sx={{ minHeight: "56px !important", px: 2 }}>
                    <IconButton
                        edge="start"
                        onClick={() => setMobileOpen(true)}
                        sx={{ color: "white", mr: 1 }}>
                        <MenuRoundedIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={800} color="white" sx={{ flexGrow: 1 }}>
                        Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                    </Typography>
                    {user && (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#FF6B6B", fontWeight: 700, fontSize: 13 }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: DRAWER_WIDTH, bgcolor: "#1B2B4B", boxSizing: "border-box", borderRight: "none" }
                }}>
                <SidebarContent user={user} location={location} handleLogout={handleLogout} onClose={() => setMobileOpen(false)} />
            </Drawer>

            {/* Desktop Permanent Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": { width: DRAWER_WIDTH, bgcolor: "#1B2B4B", boxSizing: "border-box", borderRight: "none" }
                }}>
                <SidebarContent user={user} location={location} handleLogout={handleLogout} onClose={null} />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    pt: { xs: "72px", md: 4 },
                    bgcolor: "#F8F9FA",
                    minHeight: "100vh",
                    width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` }
                }}>
                <Outlet />
            </Box>
        </Box>
    );
}
