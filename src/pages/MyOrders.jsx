import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Paper, Chip, CircularProgress,
    Box, Grid, Card, CardContent, Divider, Button
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { getMyOrders } from "../services/orderService";

const statusColor = { pending: "warning", shipped: "info", delivered: "success", cancelled: "error" };
const statusIcon = { pending: "⏳", shipped: "🚚", delivered: "✅", cancelled: "❌" };

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders().then((d) => setOrders(d.orders || [])).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={50} />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <ShoppingBagIcon color="primary" sx={{ fontSize: 35 }} />
                <Typography variant="h4" fontWeight="bold">My Orders</Typography>
            </Box>

            {orders.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>No orders yet</Typography>
                    <Button component={Link} to="/products" variant="contained" sx={{ mt: 2, textTransform: "none" }}>
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((o) => (
                        <Grid item xs={12} key={o._id}>
                            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 15px rgba(0,0,0,0.08)" }}>
                                <CardContent>
                                    {/* Order Header */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Order ID</Typography>
                                            <Typography fontFamily="monospace" fontWeight="bold">#{o._id.slice(-10).toUpperCase()}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Date</Typography>
                                            <Typography>{new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Total</Typography>
                                            <Typography fontWeight="bold" variant="h6" color="primary">${o.totalAmount.toFixed(2)}</Typography>
                                        </Box>
                                        <Chip
                                            label={`${statusIcon[o.status]} ${o.status.charAt(0).toUpperCase() + o.status.slice(1)}`}
                                            color={statusColor[o.status]}
                                            sx={{ fontWeight: "bold", px: 1 }}
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Items */}
                                    <Grid container spacing={2}>
                                        {o.items.map((item) => (
                                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                                <Box display="flex" gap={2} alignItems="center">
                                                    <Box component="img"
                                                        src={item.product?.image || `https://placehold.co/60x60?text=${encodeURIComponent(item.name)}`}
                                                        sx={{ width: 55, height: 55, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ${item.price} × {item.quantity}
                                                        </Typography>
                                                        <Typography variant="body2" color="primary" fontWeight="bold">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Shipping */}
                                    {o.shippingAddress?.city && (
                                        <>
                                            <Divider sx={{ mt: 2, mb: 1 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                📍 {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.country}
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
