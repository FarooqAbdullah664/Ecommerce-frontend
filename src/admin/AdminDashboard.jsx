import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Grid, Card, CardContent, Typography, Box, CircularProgress,
    Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Avatar
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { getAllUsers } from "../services/userService";
import { getProducts } from "../services/productService";
import { getAllOrders } from "../services/orderService";
import { getAllCards } from "../services/cardService";

const statusColor = { pending: "warning", shipped: "info", delivered: "success", cancelled: "error" };

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, cards: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllUsers(), getProducts({ limit: 200 }), getAllOrders(), getAllCards()])
            .then(([u, p, o, c]) => {
                const revenue = (o.orders || []).reduce((sum, ord) => sum + ord.totalAmount, 0);
                setStats({
                    users: u.users?.length || 0,
                    products: p.total || 0,
                    orders: o.orders?.length || 0,
                    cards: c.cards?.length || 0,
                    revenue
                });
                setRecentOrders((o.orders || []).slice(0, 5));
            })
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: "Total Revenue", value: `$${stats.revenue.toFixed(0)}`, icon: <TrendingUpIcon />, color: "#6366f1", bg: "#ede9fe" },
        { label: "Total Orders", value: stats.orders, icon: <ShoppingBagIcon />, color: "#f59e0b", bg: "#fef3c7" },
        { label: "Total Products", value: stats.products, icon: <InventoryIcon />, color: "#10b981", bg: "#d1fae5" },
        { label: "Total Users", value: stats.users, icon: <PeopleIcon />, color: "#3b82f6", bg: "#dbeafe" },
    ];

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={50} />
        </Box>
    );

    return (
        <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>Dashboard</Typography>
            <Typography color="text.secondary" mb={4}>Welcome back! Here's what's happening.</Typography>

            {/* Stat Cards */}
            <Grid container spacing={3} mb={4}>
                {statCards.map((c) => (
                    <Grid item xs={12} sm={6} md={3} key={c.label}>
                        <Card sx={{ borderRadius: 4, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" fontWeight={500} mb={1}>
                                            {c.label}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800}>{c.value}</Typography>
                                    </Box>
                                    <Box sx={{
                                        width: 52, height: 52, borderRadius: 3,
                                        bgcolor: c.bg, color: c.color,
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        {c.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Orders */}
            <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
                    <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
                </Box>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                            {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                                <TableCell key={h} sx={{ fontWeight: 700, color: "#64748b", fontSize: 13 }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recentOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                    No orders yet
                                </TableCell>
                            </TableRow>
                        ) : recentOrders.map((o) => (
                            <TableRow key={o._id} hover>
                                <TableCell sx={{ fontFamily: "monospace", fontWeight: 600, color: "#6366f1" }}>
                                    #{o._id.slice(-8).toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#ede9fe", color: "#6366f1", fontSize: 13, fontWeight: 700 }}>
                                            {o.user?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{o.user?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{o.user?.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell><Typography fontWeight={700} color="success.main">${o.totalAmount.toFixed(2)}</Typography></TableCell>
                                <TableCell>
                                    <Chip label={o.status} color={statusColor[o.status]} size="small"
                                        sx={{ fontWeight: 600, textTransform: "capitalize" }} />
                                </TableCell>
                                <TableCell sx={{ color: "#64748b", fontSize: 13 }}>
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
