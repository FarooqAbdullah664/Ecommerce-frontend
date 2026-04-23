import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Divider, IconButton, Paper, Grid, Chip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
    const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) return navigate("/login");
        navigate("/checkout");
    };

    if (cart.length === 0) return (
        <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
            <Box sx={{ fontSize: 90, mb: 3 }}>🛒</Box>
            <Typography variant="h4" fontWeight={800} color="#1B2B4B" gutterBottom>Your cart is empty</Typography>
            <Typography color="text.secondary" mb={4}>Looks like you haven't added anything yet</Typography>
            <Button component={Link} to="/products" variant="contained" size="large"
                sx={{ bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" }, borderRadius: 2, px: 5 }}>
                Start Shopping
            </Button>
        </Container>
    );

    const shipping = total >= 50 ? 0 : 9.99;
    const grandTotal = total + shipping;

    return (
        <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", py: 5 }}>
            <Container maxWidth="lg">
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <ShoppingCartIcon sx={{ color: "#1B2B4B", fontSize: 28 }} />
                    <Typography variant="h4" fontWeight={800} color="#1B2B4B">Shopping Cart</Typography>
                    <Chip label={`${cart.length} items`} sx={{ bgcolor: "#EEF2FF", color: "#1B2B4B", fontWeight: 700 }} />
                </Box>

                <Grid container spacing={4}>
                    {/* Items */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 16px rgba(27,43,75,0.08)", border: "1px solid #E5E7EB" }}>
                            {cart.map((item, index) => (
                                <Box key={item._id}>
                                    <Box sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
                                        <Box component="img"
                                            src={item.image || `https://placehold.co/90x90/EEF2FF/1B2B4B?text=${encodeURIComponent(item.name)}`}
                                            sx={{ width: 85, height: 85, borderRadius: 2.5, objectFit: "cover", flexShrink: 0, border: "1px solid #E5E7EB" }}
                                        />
                                        <Box flexGrow={1}>
                                            <Typography fontWeight={700} color="#1B2B4B">{item.name}</Typography>
                                            {item.brand && <Typography variant="caption" color="text.secondary">by {item.brand}</Typography>}
                                            <Chip label={item.category} size="small" sx={{ mt: 0.5, bgcolor: "#EEF2FF", color: "#1B2B4B", fontSize: 11 }} />
                                        </Box>

                                        {/* Qty */}
                                        <Box display="flex" alignItems="center" sx={{ border: "1px solid #E5E7EB", borderRadius: 2, overflow: "hidden" }}>
                                            <IconButton size="small" onClick={() => updateQty(item._id, item.quantity - 1)} sx={{ color: "#1B2B4B", borderRadius: 0, "&:hover": { bgcolor: "#F8F9FA" } }}>
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography fontWeight={700} sx={{ px: 2, minWidth: 36, textAlign: "center", color: "#1B2B4B" }}>{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => updateQty(item._id, item.quantity + 1)} sx={{ color: "#1B2B4B", borderRadius: 0, "&:hover": { bgcolor: "#F8F9FA" } }}>
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Price */}
                                        <Box textAlign="right" sx={{ minWidth: 80 }}>
                                            <Typography fontWeight={800} variant="h6" color="#1B2B4B">
                                                ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">${item.discountPrice || item.price} each</Typography>
                                        </Box>

                                        {/* Delete */}
                                        <IconButton onClick={() => removeFromCart(item._id)}
                                            sx={{ color: "#FF6B6B", bgcolor: "#fff5f5", "&:hover": { bgcolor: "#fee2e2" } }}>
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    {index < cart.length - 1 && <Divider />}
                                </Box>
                            ))}
                            <Box sx={{ p: 2, bgcolor: "#F8F9FA", borderTop: "1px solid #E5E7EB" }}>
                                <Button onClick={clearCart} size="small" sx={{ color: "#FF6B6B", fontWeight: 600 }}>
                                    Clear Cart
                                </Button>
                            </Box>
                        </Paper>

                        {/* Shipping notice */}
                        <Box sx={{ mt: 2, p: 2, borderRadius: 2.5, bgcolor: total >= 50 ? "#ECFDF5" : "#FFFBEB", border: `1px solid ${total >= 50 ? "#A7F3D0" : "#FDE68A"}`, display: "flex", alignItems: "center", gap: 1.5 }}>
                            <LocalShippingIcon sx={{ color: total >= 50 ? "#10b981" : "#f59e0b", fontSize: 20 }} />
                            <Typography variant="body2" color={total >= 50 ? "#065f46" : "#92400e"}>
                                {total >= 50 ? "🎉 You qualify for FREE shipping!" : `Add $${(50 - total).toFixed(2)} more for FREE shipping`}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ borderRadius: 3, p: 3, boxShadow: "0 2px 16px rgba(27,43,75,0.08)", border: "1px solid #E5E7EB", position: "sticky", top: 80 }}>
                            <Typography variant="h6" fontWeight={800} color="#1B2B4B" mb={3}>Order Summary</Typography>

                            <Box display="flex" justifyContent="space-between" mb={1.5}>
                                <Typography color="text.secondary">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</Typography>
                                <Typography fontWeight={600} color="#1B2B4B">${total.toFixed(2)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography color="text.secondary">Shipping</Typography>
                                {shipping === 0
                                    ? <Chip label="FREE" size="small" sx={{ bgcolor: "#ECFDF5", color: "#065f46", fontWeight: 700 }} />
                                    : <Typography fontWeight={600} color="#1B2B4B">${shipping.toFixed(2)}</Typography>
                                }
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box display="flex" justifyContent="space-between" mb={3}>
                                <Typography fontWeight={800} variant="h6" color="#1B2B4B">Total</Typography>
                                <Typography fontWeight={800} variant="h6" color="#FF6B6B">${grandTotal.toFixed(2)}</Typography>
                            </Box>

                            <Button variant="contained" fullWidth size="large" endIcon={<ArrowForwardIcon />}
                                onClick={handleCheckout}
                                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" }, boxShadow: "0 4px 14px rgba(27,43,75,0.25)" }}>
                                Proceed to Checkout
                            </Button>

                            <Button component={Link} to="/products" fullWidth sx={{ mt: 1.5, color: "#6B7280", fontWeight: 500 }}>
                                ← Continue Shopping
                            </Button>

                            <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                {["🔒 Secure Checkout", "↩️ Easy Returns", "🚚 Fast Delivery"].map((t) => (
                                    <Typography key={t} variant="caption" color="text.secondary" display="block" textAlign="center" mb={0.5}>{t}</Typography>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
