import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Avatar, Menu, MenuItem, Divider, Container, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const handleLogout = async () => { setAnchorEl(null); await logout(); navigate("/login"); };
    const isActive = (p) => location.pathname === p;
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: scrolled ? "1px solid rgba(229,231,235,0.8)" : "1px solid transparent",
                boxShadow: scrolled ? "0 4px 30px rgba(27,43,75,0.08)" : "none",
                transition: "all 0.3s ease"
            }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ px: "0 !important", minHeight: "70px !important", gap: 1 }}>

                        {/* Logo */}
                        <Typography component={Link} to="/" sx={{
                            fontWeight: 900, textDecoration: "none", mr: 5,
                            fontSize: "1.55rem", letterSpacing: "-0.8px", color: "#1B2B4B",
                            display: "flex", alignItems: "center", gap: 0.8,
                            transition: "opacity 0.2s",
                            "&:hover": { opacity: 0.85 }
                        }}>
                            <Box sx={{
                                width: 32, height: 32, borderRadius: 2,
                                background: "linear-gradient(135deg, #1B2B4B, #2d4a7a)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <StorefrontOutlinedIcon sx={{ color: "#FF6B6B", fontSize: 18 }} />
                            </Box>
                            Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                        </Typography>

                        {/* Nav Links */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexGrow: 1 }}>
                            {[
                                { label: "Home", to: "/", icon: <HomeOutlinedIcon sx={{ fontSize: 16 }} /> },
                                { label: "Products", to: "/products", icon: <StorefrontOutlinedIcon sx={{ fontSize: 16 }} /> }
                            ].map((link) => (
                                <Button key={link.to} component={Link} to={link.to}
                                    startIcon={link.icon}
                                    sx={{
                                        color: isActive(link.to) ? "#1B2B4B" : "#6B7280",
                                        fontWeight: isActive(link.to) ? 700 : 500,
                                        px: 2, fontSize: "0.88rem",
                                        borderRadius: 2,
                                        bgcolor: isActive(link.to) ? "rgba(27,43,75,0.06)" : "transparent",
                                        position: "relative",
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 6, left: "50%",
                                            transform: isActive(link.to) ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
                                            width: "60%", height: 2,
                                            bgcolor: "#FF6B6B",
                                            borderRadius: 1,
                                            transition: "transform 0.25s ease"
                                        },
                                        "&:hover": {
                                            color: "#1B2B4B",
                                            bgcolor: "rgba(27,43,75,0.05)",
                                            "&::after": { transform: "translateX(-50%) scaleX(1)" }
                                        }
                                    }}>
                                    {link.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Right Side */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>

                            {/* Cart Button */}
                            <IconButton
                                component={Link} to="/cart"
                                sx={{
                                    color: "#1B2B4B",
                                    bgcolor: "rgba(27,43,75,0.05)",
                                    borderRadius: 2.5,
                                    width: 42, height: 42,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: "#1B2B4B",
                                        color: "white",
                                        transform: "translateY(-1px)",
                                        boxShadow: "0 4px 15px rgba(27,43,75,0.25)"
                                    }
                                }}>
                                <Badge
                                    badgeContent={cartCount}
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            bgcolor: "#FF6B6B", color: "white",
                                            fontWeight: 700, fontSize: 10,
                                            minWidth: 18, height: 18,
                                            border: "2px solid white"
                                        }
                                    }}>
                                    <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
                                </Badge>
                            </IconButton>

                            {user ? (
                                <>
                                    {/* Admin Button */}
                                    {user.role === "admin" && (
                                        <Button
                                            component={Link} to="/admin"
                                            size="small"
                                            startIcon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}
                                            sx={{
                                                display: { xs: "none", md: "flex" },
                                                color: "white",
                                                background: "linear-gradient(135deg, #1B2B4B, #2d4a7a)",
                                                borderRadius: 2.5,
                                                px: 2.5, py: 1,
                                                fontWeight: 600,
                                                fontSize: "0.82rem",
                                                boxShadow: "0 2px 10px rgba(27,43,75,0.3)",
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #0f1c33, #1B2B4B)",
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 4px 18px rgba(27,43,75,0.4)"
                                                }
                                            }}>
                                            Admin
                                        </Button>
                                    )}

                                    {/* Avatar */}
                                    <IconButton
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        sx={{
                                            p: 0.4,
                                            border: "2px solid transparent",
                                            borderRadius: "50%",
                                            transition: "all 0.2s",
                                            "&:hover": { borderColor: "#FF6B6B" }
                                        }}>
                                        <Avatar sx={{
                                            width: 36, height: 36,
                                            background: "linear-gradient(135deg, #1B2B4B, #FF6B6B)",
                                            fontWeight: 700, fontSize: 14,
                                            boxShadow: "0 2px 10px rgba(27,43,75,0.3)"
                                        }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>

                                    {/* Dropdown Menu */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}
                                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                        PaperProps={{
                                            sx: {
                                                mt: 1.5, minWidth: 250,
                                                borderRadius: 3,
                                                boxShadow: "0 12px 50px rgba(27,43,75,0.18)",
                                                border: "1px solid rgba(229,231,235,0.8)",
                                                overflow: "hidden"
                                            }
                                        }}>
                                        {/* User Info Header */}
                                        <Box sx={{
                                            px: 2.5, py: 2.5,
                                            background: "linear-gradient(135deg, #1B2B4B 0%, #2d4a7a 100%)",
                                            display: "flex", alignItems: "center", gap: 1.5
                                        }}>
                                            <Avatar sx={{
                                                width: 44, height: 44,
                                                background: "linear-gradient(135deg, #FF6B6B, #ff8e53)",
                                                fontWeight: 700, fontSize: 18,
                                                boxShadow: "0 4px 12px rgba(255,107,107,0.4)"
                                            }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight={700} color="white" variant="body2" lineHeight={1.3}>
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ py: 1 }}>
                                            {[
                                                { icon: <PersonOutlineIcon fontSize="small" />, label: "My Profile", to: "/profile" },
                                                { icon: <ReceiptLongOutlinedIcon fontSize="small" />, label: "My Orders", to: "/orders" },
                                            ].map((item) => (
                                                <MenuItem
                                                    key={item.label}
                                                    component={Link} to={item.to}
                                                    onClick={() => setAnchorEl(null)}
                                                    sx={{
                                                        py: 1.4, px: 2.5, gap: 1.5,
                                                        color: "#374151",
                                                        transition: "all 0.15s",
                                                        "&:hover": {
                                                            bgcolor: "#F8F9FA",
                                                            color: "#1B2B4B",
                                                            pl: 3
                                                        }
                                                    }}>
                                                    <Box sx={{
                                                        width: 32, height: 32, borderRadius: 2,
                                                        bgcolor: "#EEF2FF", color: "#1B2B4B",
                                                        display: "flex", alignItems: "center", justifyContent: "center"
                                                    }}>
                                                        {item.icon}
                                                    </Box>
                                                    <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Box>

                                        <Divider sx={{ borderColor: "#F3F4F6" }} />

                                        <MenuItem
                                            onClick={handleLogout}
                                            sx={{
                                                py: 1.4, px: 2.5, gap: 1.5,
                                                color: "#FF6B6B",
                                                transition: "all 0.15s",
                                                "&:hover": { bgcolor: "#fff5f5", pl: 3 }
                                            }}>
                                            <Box sx={{
                                                width: 32, height: 32, borderRadius: 2,
                                                bgcolor: "#fff0f0", color: "#FF6B6B",
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <LogoutOutlinedIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="body2" fontWeight={600}>Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box display="flex" gap={1}>
                                    <Button
                                        component={Link} to="/login"
                                        variant="outlined" size="small"
                                        sx={{
                                            display: { xs: "none", sm: "flex" },
                                            borderRadius: 2.5, px: 2.5,
                                            borderColor: "#E5E7EB", color: "#1B2B4B",
                                            fontWeight: 600, fontSize: "0.85rem",
                                            "&:hover": { borderColor: "#1B2B4B", bgcolor: "rgba(27,43,75,0.04)" }
                                        }}>
                                        Login
                                    </Button>
                                    <Button
                                        component={Link} to="/signup"
                                        variant="contained" size="small"
                                        sx={{
                                            borderRadius: 2.5, px: 2.5,
                                            fontWeight: 600, fontSize: "0.85rem",
                                            background: "linear-gradient(135deg, #FF6B6B, #ff8e53)",
                                            boxShadow: "0 2px 10px rgba(255,107,107,0.35)",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #ff5252, #FF6B6B)",
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 4px 18px rgba(255,107,107,0.45)"
                                            }
                                        }}>
                                        Register
                                    </Button>
                                </Box>
                            )}

                            {/* Mobile Menu Button */}
                            <IconButton
                                sx={{
                                    display: { md: "none" },
                                    color: "#1B2B4B",
                                    bgcolor: "rgba(27,43,75,0.05)",
                                    borderRadius: 2,
                                    ml: 0.5
                                }}
                                onClick={() => setMobileOpen(true)}>
                                <MenuRoundedIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: "linear-gradient(180deg, #1B2B4B 0%, #0f1c33 100%)"
                    }
                }}>
                <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography fontWeight={900} fontSize="1.4rem" sx={{ color: "white" }}>
                            Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                        </Typography>
                        <IconButton
                            onClick={() => setMobileOpen(false)}
                            sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>

                    <List sx={{ p: 0 }}>
                        {[
                            { label: "Home", to: "/", icon: <HomeOutlinedIcon /> },
                            { label: "Products", to: "/products", icon: <StorefrontOutlinedIcon /> }
                        ].map((link) => (
                            <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link} to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: 2.5, py: 1.4, px: 2,
                                        gap: 1.5,
                                        color: isActive(link.to) ? "white" : "rgba(255,255,255,0.6)",
                                        bgcolor: isActive(link.to) ? "rgba(255,107,107,0.2)" : "transparent",
                                        fontWeight: isActive(link.to) ? 700 : 500,
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)", color: "white" }
                                    }}>
                                    {link.icon}
                                    <Typography variant="body2" fontWeight="inherit">{link.label}</Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Navbar;
