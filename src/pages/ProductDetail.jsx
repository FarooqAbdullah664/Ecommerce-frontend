import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Container, Grid, Typography, Button, Box, Chip,
    CircularProgress, Divider, TextField, Snackbar, Alert,
    Breadcrumbs, Paper, Skeleton
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [snack, setSnack] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        getProductById(id)
            .then((d) => setProduct(d.product))
            .catch(() => navigate("/products"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setSnack(true);
    };

    const handleBuyNow = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        navigate("/cart");
    };

    const discount = product?.discountPrice
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : 0;

    const guarantees = [
        { icon: <LocalShippingIcon sx={{ fontSize: 18 }} />, text: "Free shipping over $50", color: "#6366f1" },
        { icon: <AutorenewIcon sx={{ fontSize: 18 }} />, text: "30-day easy returns", color: "#10b981" },
        { icon: <SecurityIcon sx={{ fontSize: 18 }} />, text: "Secure checkout", color: "#f59e0b" },
    ];

    if (loading) return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={5}>
                        <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 4 }} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Skeleton variant="text" width="30%" height={30} />
                        <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="40%" height={60} sx={{ mt: 2 }} />
                        <Skeleton variant="rectangular" height={120} sx={{ mt: 3, borderRadius: 3 }} />
                        <Skeleton variant="rectangular" height={56} sx={{ mt: 3, borderRadius: 3 }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    if (!product) return null;

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>

                {/* Breadcrumb */}
                <Box display="flex" alignItems="center" gap={{ xs: 1, md: 2 }} mb={{ xs: 3, md: 4 }} flexWrap="wrap">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
                        sx={{ color: "#64748b", borderRadius: 3, "&:hover": { bgcolor: "#f0f0ff", color: "#6366f1" } }}>
                        Back
                    </Button>
                    <Breadcrumbs sx={{ "& a": { color: "#6366f1", textDecoration: "none", fontWeight: 500 } }}>
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                        <Typography color="text.primary" fontWeight={600} sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}>{product.name}</Typography>
                    </Breadcrumbs>
                </Box>

                <Grid container spacing={{ xs: 3, md: 6 }}>
                    {/* ===== IMAGE ===== */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ position: { md: "sticky" }, top: { md: 90 } }}>
                            <Paper elevation={0} sx={{
                                borderRadius: 5, overflow: "hidden",
                                border: "1px solid #f1f5f9",
                                bgcolor: "white",
                                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                                position: "relative"
                            }}>
                                {discount > 0 && (
                                    <Chip label={`${discount}% OFF`} color="error"
                                        sx={{ position: "absolute", top: 16, left: 16, zIndex: 1, fontWeight: 800, fontSize: 13 }} />
                                )}
                                <Box component="img"
                                    src={product.image || `https://placehold.co/600x500/f0f0ff/6366f1?text=${encodeURIComponent(product.name)}`}
                                    alt={product.name}
                                    sx={{
                                        width: "100%", display: "block",
                                        objectFit: "cover", maxHeight: 480,
                                        transition: "transform 0.4s ease",
                                        "&:hover": { transform: "scale(1.04)" }
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Grid>

                    {/* ===== DETAILS ===== */}
                    <Grid item xs={12} md={7}>
                        {/* Tags */}
                        <Box display="flex" gap={1} mb={2.5} flexWrap="wrap">
                            <Chip label={product.category}
                                sx={{ bgcolor: "#ede9fe", color: "#6366f1", fontWeight: 700 }} />
                            {product.brand && (
                                <Chip label={`by ${product.brand}`} variant="outlined"
                                    sx={{ borderColor: "#e2e8f0", color: "#64748b" }} />
                            )}
                            {discount > 0 && (
                                <Chip label={`Save ${discount}%`} color="error" variant="outlined" />
                            )}
                        </Box>

                        {/* Name */}
                        <Typography fontWeight={800} gutterBottom
                            sx={{ lineHeight: 1.2, color: "#0f172a", fontSize: { xs: "1.6rem", md: "3rem" } }}>
                            {product.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                            SKU: {product.sku}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Description */}
                        <Typography variant="body1" color="text.secondary" lineHeight={1.9} mb={3}>
                            {product.description}
                        </Typography>

                        {/* Price */}
                        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "white", borderRadius: 4, border: "1px solid #f1f5f9", mb: 3 }}>
                            <Box display="flex" gap={2} alignItems="center" mb={1}>
                                {product.discountPrice ? (
                                    <>
                                        <Typography variant="h3" color="error.main" fontWeight={900} lineHeight={1}>
                                            ${product.discountPrice}
                                        </Typography>
                                        <Box>
                                            <Typography sx={{ textDecoration: "line-through", color: "#94a3b8", fontSize: 20 }}>
                                                ${product.price}
                                            </Typography>
                                            <Chip label={`You save $${(product.price - product.discountPrice).toFixed(2)}`}
                                                size="small" color="success"
                                                sx={{ fontWeight: 700, fontSize: 11 }} />
                                        </Box>
                                    </>
                                ) : (
                                    <Typography variant="h3" color="primary.main" fontWeight={900} lineHeight={1}>
                                        ${product.price}
                                    </Typography>
                                )}
                            </Box>

                            {/* Stock */}
                            <Box display="flex" alignItems="center" gap={1} mt={1.5}>
                                <Box sx={{
                                    width: 10, height: 10, borderRadius: "50%",
                                    bgcolor: product.stock > 0 ? "#10b981" : "#ef4444",
                                    boxShadow: product.stock > 0 ? "0 0 8px rgba(16,185,129,0.5)" : "none"
                                }} />
                                <Typography fontWeight={700} color={product.stock > 0 ? "success.main" : "error.main"}>
                                    {product.stock > 5 ? `In Stock (${product.stock} available)`
                                        : product.stock > 0 ? `Only ${product.stock} left!`
                                            : "Out of Stock"}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Qty + Buttons */}
                        {product.stock > 0 && (
                            <Box>
                                <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1.5}>
                                    QUANTITY
                                </Typography>
                                <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
                                    <Box display="flex" alignItems="center"
                                        sx={{ border: "2px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                                        <Button size="small" onClick={() => setQty(Math.max(1, qty - 1))}
                                            sx={{ minWidth: 44, height: 44, color: "#64748b", borderRadius: 0, "&:hover": { bgcolor: "#f0f0ff", color: "#6366f1" } }}>
                                            <RemoveIcon fontSize="small" />
                                        </Button>
                                        <Typography fontWeight={800} sx={{ px: 2.5, minWidth: 50, textAlign: "center" }}>
                                            {qty}
                                        </Typography>
                                        <Button size="small" onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                            sx={{ minWidth: 44, height: 44, color: "#64748b", borderRadius: 0, "&:hover": { bgcolor: "#f0f0ff", color: "#6366f1" } }}>
                                            <AddIcon fontSize="small" />
                                        </Button>
                                    </Box>

                                    <Button variant="outlined" size="large"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={handleAddToCart}
                                        sx={{
                                            borderRadius: 3, px: 3, fontWeight: 700,
                                            borderColor: "#6366f1", color: "#6366f1",
                                            flex: { xs: 1, sm: "unset" },
                                            "&:hover": { bgcolor: "#f0f0ff" }
                                        }}>
                                        Add to Cart
                                    </Button>

                                    <Button variant="contained" size="large"
                                        startIcon={<FlashOnIcon />}
                                        onClick={handleBuyNow}
                                        sx={{
                                            borderRadius: 3, px: 4, fontWeight: 700,
                                            flex: { xs: 1, sm: "unset" },
                                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                            boxShadow: "0 8px 25px rgba(99,102,241,0.35)",
                                            "&:hover": { boxShadow: "0 12px 35px rgba(99,102,241,0.5)" }
                                        }}>
                                        Buy Now
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Guarantees */}
                        <Box sx={{ p: 3, bgcolor: "white", borderRadius: 4, border: "1px solid #f1f5f9" }}>
                            {guarantees.map((g, i) => (
                                <Box key={i} display="flex" alignItems="center" gap={1.5}
                                    sx={{ mb: i < guarantees.length - 1 ? 1.5 : 0 }}>
                                    <Box sx={{ color: g.color }}>{g.icon}</Box>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                                        {g.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={snack} autoHideDuration={2500} onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity="success" onClose={() => setSnack(false)} sx={{ borderRadius: 3, fontWeight: 600 }}>
                    ✓ Added to cart!
                </Alert>
            </Snackbar>
        </Box>
    );
}
