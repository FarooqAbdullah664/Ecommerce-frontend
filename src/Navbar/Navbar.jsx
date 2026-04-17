import { Link, useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Button, Box, Badge,
    IconButton, Avatar, Menu, MenuItem, Divider
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
        navigate("/login");
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#0f172a", boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            <Toolbar sx={{ gap: 1 }}>
                {/* Logo */}
                <Typography variant="h6" component={Link} to="/"
                    sx={{ flexGrow: 1, fontWeight: "bold", color: "#38bdf8", textDecoration: "none", fontSize: "1.3rem" }}>
                    🛍️ ShopZone
                </Typography>

                {/* Nav Links */}
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <Button component={Link} to="/"
                        sx={{ color: "white", textTransform: "none", fontWeight: 500 }}>
                        Home
                    </Button>
                    <Button component={Link} to="/products"
                        sx={{ color: "white", textTransform: "none", fontWeight: 500 }}>
                        Products
                    </Button>

                    {/* Cart */}
                    <IconButton component={Link} to="/cart" sx={{ color: "white", mx: 0.5 }}>
                        <Badge badgeContent={cart.reduce((s, i) => s + i.quantity, 0)} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Button component={Link} to="/admin"
                                    sx={{
                                        color: "#fbbf24", textTransform: "none", fontWeight: 600,
                                        border: "1px solid #fbbf24", borderRadius: 2, px: 2,
                                        "&:hover": { bgcolor: "rgba(251,191,36,0.1)" }
                                    }}>
                                    Admin Panel
                                </Button>
                            )}

                            {/* User Avatar Menu */}
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                                <Avatar sx={{ width: 35, height: 35, bgcolor: "#6366f1", fontSize: 14 }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}>
                                <Box sx={{ px: 2, py: 1 }}>
                                    <Typography fontWeight="bold" variant="body2">{user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                </Box>
                                <Divider />
                                <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>
                                    My Profile
                                </MenuItem>
                                <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>
                                    My Orders
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/login"
                                sx={{ color: "white", textTransform: "none", fontWeight: 500 }}>
                                Login
                            </Button>
                            <Button component={Link} to="/signup" variant="contained"
                                sx={{
                                    background: "linear-gradient(90deg,#38bdf8,#6366f1)",
                                    textTransform: "none", fontWeight: 600, borderRadius: 2
                                }}>
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
