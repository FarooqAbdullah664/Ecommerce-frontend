import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { getAllUsers } from "../services/userService";
import { getProducts } from "../services/productService";
import { getAllOrders } from "../services/orderService";
import { getAllCards } from "../services/cardService";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, cards: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllUsers(), getProducts(), getAllOrders(), getAllCards()])
            .then(([u, p, o, c]) => setStats({
                users: u.users?.length || 0,
                products: p.total || 0,
                orders: o.orders?.length || 0,
                cards: c.cards?.length || 0,
            }))
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: "Total Users", value: stats.users, icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: "#6366f1" },
        { label: "Total Products", value: stats.products, icon: <InventoryIcon sx={{ fontSize: 40 }} />, color: "#38bdf8" },
        { label: "Total Orders", value: stats.orders, icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />, color: "#f59e0b" },
        { label: "Saved Cards", value: stats.cards, icon: <CreditCardIcon sx={{ fontSize: 40 }} />, color: "#10b981" },
    ];

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                {cards.map((c) => (
                    <Grid item xs={12} sm={6} md={3} key={c.label}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography color="text.secondary" variant="body2">{c.label}</Typography>
                                        <Typography variant="h3" fontWeight="bold">{c.value}</Typography>
                                    </Box>
                                    <Box sx={{ color: c.color }}>{c.icon}</Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
