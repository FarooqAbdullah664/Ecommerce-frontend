import { Link, useNavigate } from "react-router-dom";
import {
    Drawer, Box, Typography, IconButton, Button,
    Divider, Chip, Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartDrawer({ open, onClose }) {
    const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        if (!user) return navigate("/login");
        navigate("/checkout");
    };

    const shipping = total >= 50 ? 0 : 9.99;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 420 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "white"
                }
            }}
        >
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#1B2B4B" }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <ShoppingCartIcon sx={{ color: "white", fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={800} color="white">Your Cart</Typography>
                    {cart.length > 0 && (
                        <Chip label={cart.reduce((s, i) => s + i.quantity, 0)} size="small"
                            sx={{ bgcolor: "#FF6B6B", color: "white", fontWeight: 800, height: 22, fontSize: 12 }} />
                    )}
                </Box>
                <IconButton onClick={onClose} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Empty State */}
            {cart.length === 0 ? (
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 80, mb: 2 }}>🛒</Typography>
                    <Typography variant="h6" fontWeight={700} color="#1B2B4B" gutterBottom>Cart is empty</Typography>
                    <Typography color="text.secondary" mb={3}>Add some products to get started</Typography>
                    <Button component={Link} to="/products" variant="contained" onClick={onClose}
                        sx={{ bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" }, borderRadius: 2 }}>
                        Browse Products
                    </Button>
                </Box>
            ) : (
                <>
                    {/* Items List */}
                    <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 2 }}>
                        {cart.map((item, index) => (
                            <Box key={item._id}>
                                <Box sx={{ display: "flex", gap: 2, py: 2, alignItems: "flex-start" }}>
                                    {/* Image */}
                                    <Box component="img"
                                        src={item.image || `https://placehold.co/80x80/EEF2FF/1B2B4B?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        sx={{ width: 80, height: 80, borderRadius: 2.5, objectFit: "cover", flexShrink: 0, border: "1px solid #E5E7EB" }}
                                    />

                                    {/* Info */}
                                    <Box flexGrow={1} minWidth={0}>
                                        <Typography fontWeight={700} color="#1B2B4B" variant="body2"
                                            sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                            {item.name}
                                        </Typography>
                                        {item.brand && (
                                            <Typography variant="caption" color="text.secondary">by {item.brand}</Typography>
                                        )}
                                        <Chip label={item.category} size="small"
                                            sx={{ mt: 0.5, bgcolor: "#EEF2FF", color: "#1B2B4B", fontSize: 10, height: 20 }} />

                                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1.5}>
                                            {/* Qty controls */}
                                            <Box display="flex" alignItems="center" sx={{ border: "1px solid #E5E7EB", borderRadius: 1.5, overflow: "hidden" }}>
                                                <IconButton size="small" onClick={() => updateQty(item._id, item.quantity - 1)}
                                                    sx={{ color: "#1B2B4B", borderRadius: 0, p: 0.5, "&:hover": { bgcolor: "#F8F9FA" } }}>
                                                    <RemoveIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                                <Typography fontWeight={700} sx={{ px: 1.5, fontSize: 13, color: "#1B2B4B" }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton size="small" onClick={() => updateQty(item._id, item.quantity + 1)}
                                                    sx={{ color: "#1B2B4B", borderRadius: 0, p: 0.5, "&:hover": { bgcolor: "#F8F9FA" } }}>
                                                    <AddIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Box>

                                            {/* Price */}
                                            <Typography fontWeight={800} color="#FF6B6B" variant="body1">
                                                ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {/* Per item price */}
                                        {item.discountPrice ? (
                                            <Box display="flex" gap={1} mt={0.5}>
                                                <Typography variant="caption" color="#FF6B6B" fontWeight={700}>${item.discountPrice} each</Typography>
                                                <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#9CA3AF" }}>${item.price}</Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">${item.price} each</Typography>
                                        )}
                                    </Box>

                                    {/* Delete */}
                                    <IconButton size="small" onClick={() => removeFromCart(item._id)}
                                        sx={{ color: "#FF6B6B", bgcolor: "#fff5f5", "&:hover": { bgcolor: "#fee2e2" }, flexShrink: 0 }}>
                                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                                {index < cart.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>

                    {/* Footer */}
                    <Box sx={{ borderTop: "1px solid #E5E7EB", p: 3, bgcolor: "#F8F9FA" }}>
                        {/* Shipping notice */}
                        {total < 50 && (
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: "#FFFBEB", borderRadius: 2, border: "1px solid #FDE68A" }}>
                                <Typography variant="caption" color="#92400e" fontWeight={600}>
                                    🚚 Add ${(50 - total).toFixed(2)} more for FREE shipping!
                                </Typography>
                            </Box>
                        )}

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography color="text.secondary" variant="body2">Subtotal</Typography>
                            <Typography fontWeight={700} color="#1B2B4B">${total.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography color="text.secondary" variant="body2">Shipping</Typography>
                            {shipping === 0
                                ? <Typography variant="body2" fontWeight={700} color="#10b981">FREE</Typography>
                                : <Typography variant="body2" fontWeight={700} color="#1B2B4B">${shipping.toFixed(2)}</Typography>
                            }
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="flex" justifyContent="space-between" mb={2.5}>
                            <Typography fontWeight={800} color="#1B2B4B">Total</Typography>
                            <Typography fontWeight={800} color="#FF6B6B" variant="h6">${(total + shipping).toFixed(2)}</Typography>
                        </Box>

                        <Button variant="contained" fullWidth size="large" endIcon={<ArrowForwardIcon />}
                            onClick={handleCheckout}
                            sx={{ py: 1.4, borderRadius: 2, fontWeight: 700, bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" }, mb: 1.5 }}>
                            Proceed to Checkout
                        </Button>

                        <Box display="flex" gap={1}>
                            <Button component={Link} to="/cart" onClick={onClose} variant="outlined" fullWidth
                                sx={{ borderRadius: 2, borderColor: "#E5E7EB", color: "#6B7280", "&:hover": { borderColor: "#1B2B4B", color: "#1B2B4B" } }}>
                                View Full Cart
                            </Button>
                            <Button onClick={clearCart} variant="outlined" color="error" size="small"
                                sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}>
                                Clear
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Drawer>
    );
}
