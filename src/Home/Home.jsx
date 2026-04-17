import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Typography, Button, Box, Grid, Card, CardMedia,
    CardContent, CardActions, Chip, Container
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        getProducts({ limit: 8 }).then((d) => setFeatured(d.products || [])).catch(() => {});
    }, []);

    const features = [
        { icon: <LocalShippingIcon sx={{ fontSize: 36, color: "#38bdf8" }} />, title: "Free Shipping", desc: "On orders over $50" },
        { icon: <SecurityIcon sx={{ fontSize: 36, color: "#38bdf8" }} />, title: "Secure Payment", desc: "100% secure transactions" },
        { icon: <SupportAgentIcon sx={{ fontSize: 36, color: "#38bdf8" }} />, title: "24/7 Support", desc: "Always here to help" },
    ];

    return (
        <Box>
            {/* Hero Section - Full Width */}
            <Box sx={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
                color: "white",
                py: { xs: 8, md: 14 },
                textAlign: "center",
                width: "100%"
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="bold" gutterBottom
                        sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}>
                        Welcome to{" "}
                        <Box component="span" sx={{ color: "#38bdf8" }}>ShopZone</Box>
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#94a3b8", mb: 5, maxWidth: 500, mx: "auto" }}>
                        Discover amazing products at unbeatable prices
                    </Typography>
                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <Button component={Link} to="/products" variant="contained" size="large"
                            sx={{
                                background: "linear-gradient(90deg,#38bdf8,#6366f1)",
                                px: 5, py: 1.5, borderRadius: 3, fontWeight: "bold",
                                fontSize: "1rem", textTransform: "none",
                                boxShadow: "0 8px 25px rgba(56,189,248,0.4)",
                                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(56,189,248,0.5)" }
                            }}>
                            Shop Now
                        </Button>
                        <Button component={Link} to="/signup" variant="outlined" size="large"
                            sx={{
                                borderColor: "#38bdf8", color: "#38bdf8", px: 5, py: 1.5,
                                borderRadius: 3, fontWeight: "bold", fontSize: "1rem", textTransform: "none",
                                "&:hover": { borderColor: "#38bdf8", bgcolor: "rgba(56,189,248,0.1)" }
                            }}>
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Bar */}
            <Box sx={{ bgcolor: "#1e293b", py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} justifyContent="center">
                        {features.map((f) => (
                            <Grid item xs={12} sm={4} key={f.title}>
                                <Box display="flex" alignItems="center" gap={2} justifyContent={{ xs: "center", sm: "flex-start" }}>
                                    {f.icon}
                                    <Box>
                                        <Typography fontWeight="bold" color="white">{f.title}</Typography>
                                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>{f.desc}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Featured Products */}
            <Container maxWidth="lg" sx={{ py: 7 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold">Featured Products</Typography>
                    <Button component={Link} to="/products" variant="outlined">View All</Button>
                </Box>

                {featured.length === 0 ? (
                    <Box textAlign="center" py={6}>
                        <Typography color="text.secondary" variant="h6">No products yet. Admin se products add karwao.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {featured.map((p) => (
                            <Grid item xs={12} sm={6} md={3} key={p._id}>
                                <Card sx={{
                                    height: "100%", display: "flex", flexDirection: "column",
                                    borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }
                                }}>
                                    <CardMedia component="img" height="200"
                                        image={p.image || `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(p.name)}`}
                                        alt={p.name} sx={{ objectFit: "cover" }} />
                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Chip label={p.category} size="small" sx={{ mb: 1, bgcolor: "#e0f2fe", color: "#0369a1" }} />
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap>{p.name}</Typography>
                                        <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                                            {p.discountPrice ? (
                                                <>
                                                    <Typography color="error.main" fontWeight="bold" variant="h6">${p.discountPrice}</Typography>
                                                    <Typography sx={{ textDecoration: "line-through", color: "#94a3b8", fontSize: 13 }}>${p.price}</Typography>
                                                </>
                                            ) : (
                                                <Typography color="primary.main" fontWeight="bold" variant="h6">${p.price}</Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                        <Button component={Link} to={`/products/${p._id}`} size="small"
                                            variant="outlined" fullWidth sx={{ textTransform: "none" }}>
                                            Details
                                        </Button>
                                        <Button size="small" variant="contained" fullWidth
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={() => addToCart(p)}
                                            sx={{ textTransform: "none", background: "linear-gradient(90deg,#38bdf8,#6366f1)" }}>
                                            Add
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Footer */}
            <Box sx={{ bgcolor: "#0f172a", color: "#94a3b8", py: 4, textAlign: "center" }}>
                <Typography>© 2026 ShopZone. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}
