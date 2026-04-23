import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Chip, CircularProgress,
    Box, Grid, Card, CardContent, Divider, Button, Skeleton
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getMyOrders } from "../services/orderService";

const statusConfig = {
    pending:   { color: "warning", bg: "#fef3c7", text: "#92400e", icon: "⏳", label: "Pending" },
    shipped:   { color: "info",    bg: "#dbeafe", text: "#1e40af", icon: "🚚", label: "Shipped" },
    delivered: { color: "success", bg: "#d1fae5", text: "#065f46", icon: "✅", label: "Delivered" },
    cancelled: { color: "error",   bg: "#fee2e2", text: "#991b1b", icon: "❌", label: "Cancelled" },
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders().then((d) => setOrders(d.orders || [])).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box sx={{ bgcolor: "#f1f5f9", minHeight: "100vh", py: 5 }}>
            <Container maxWidth="lg">
                <Skeleton variant="text" width={200} height={50} sx={{ mb: 4 }} />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: 4, mb: 3 }} />
                ))}
            </Container>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "#f1f5f9", minHeight: "100vh", py: 5 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={5} flexWrap="wrap" gap={2}>
                    <Box display="flex" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
                        <Box sx={{ width: { xs: 44, md: 52 }, height: { xs: 44, md: 52 }, borderRadius: 3, bgcolor: "#ede9fe", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShoppingBagIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}>My Orders</Typography>
                            <Typography color="text.secondary" variant="body2">
                                {orders.length} order{orders.length !== 1 ? "s" : ""} total
                            </Typography>
                        </Box>
                    </Box>
                    <Button component={Link} to="/products" variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ borderRadius: 3, borderColor: "#e2e8f0", color: "#64748b", "&:hover": { borderColor: "#6366f1", color: "#6366f1" } }}>
                        Continue Shopping
                    </Button>
                </Box>

                {orders.length === 0 ? (
                    <Card sx={{ borderRadius: 5, p: 8, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                        <Typography sx={{ fontSize: 80, mb: 2 }}>📦</Typography>
                        <Typography variant="h5" fontWeight={700} gutterBottom>No orders yet</Typography>
                        <Typography color="text.secondary" mb={4}>
                            Start shopping to see your orders here
                        </Typography>
                        <Button component={Link} to="/products" variant="contained" size="large"
                            sx={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 3, px: 5 }}>
                            Shop Now
                        </Button>
                    </Card>
                ) : (
                    <Box display="flex" flexDirection="column" gap={3}>
                        {orders.map((o) => {
                            const status = statusConfig[o.status] || statusConfig.pending;
                            return (
                                <Card key={o._id} sx={{
                                    borderRadius: 5, overflow: "hidden",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                                    border: "1px solid #f1f5f9",
                                    transition: "all 0.25s",
                                    "&:hover": { boxShadow: "0 12px 40px rgba(0,0,0,0.1)", transform: "translateY(-2px)" }
                                }}>
                                    {/* Order Header Bar */}
                                    <Box sx={{
                                        px: { xs: 2, md: 3 }, py: { xs: 1.5, md: 2 },
                                        bgcolor: "#f8fafc",
                                        borderBottom: "1px solid #f1f5f9",
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", flexWrap: "wrap", gap: 2
                                    }}>
                                        <Box display="flex" gap={{ xs: 2, md: 4 }} flexWrap="wrap">
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>ORDER ID</Typography>
                                                <Typography fontFamily="monospace" fontWeight={700} color="#6366f1" sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}>
                                                    #{o._id.slice(-8).toUpperCase()}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>DATE</Typography>
                                                <Typography fontWeight={600} variant="body2">
                                                    {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>TOTAL</Typography>
                                                <Typography fontWeight={800} color="primary.main" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                                                    ${o.totalAmount.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            px: 2.5, py: 1, borderRadius: 3,
                                            bgcolor: status.bg, color: status.text,
                                            fontWeight: 700, fontSize: "0.85rem",
                                            display: "flex", alignItems: "center", gap: 0.8
                                        }}>
                                            {status.icon} {status.label}
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 3 }}>
                                        {/* Items */}
                                        <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
                                            {o.items.map((item) => (
                                                <Grid item xs={12} sm={6} md={4} key={item._id}>
                                                    <Box display="flex" gap={{ xs: 1.5, md: 2 }} alignItems="center"
                                                        sx={{ p: { xs: 1.5, md: 2 }, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #f1f5f9" }}>
                                                        <Box component="img"
                                                            src={item.product?.image || `https://placehold.co/60x60/f0f0ff/6366f1?text=${encodeURIComponent(item.name)}`}
                                                            sx={{ width: { xs: 50, md: 65 }, height: { xs: 50, md: 65 }, borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
                                                        />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700} sx={{
                                                                overflow: "hidden", display: "-webkit-box",
                                                                WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                                                            }}>
                                                                {item.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ${item.price} × {item.quantity}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={800} color="primary.main" display="block">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {/* Shipping Address */}
                                        {o.shippingAddress?.city && (
                                            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1 }}>
                                                <Typography sx={{ fontSize: 16 }}>📍</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <b>Shipped to:</b> {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.country}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
