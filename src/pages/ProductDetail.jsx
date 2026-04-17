import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Container, Grid, Typography, Button, Box, Chip,
    CircularProgress, Divider, TextField, Snackbar, Alert,
    Breadcrumbs, Paper
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={50} />
        </Box>
    );
    if (!product) return null;

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setSnack(true);
    };

    const handleBuyNow = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        navigate("/cart");
    };

    const discount = product.discountPrice
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link to="/" style={{ color: "#6366f1", textDecoration: "none" }}>Home</Link>
                <Link to="/products" style={{ color: "#6366f1", textDecoration: "none" }}>Products</Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
                sx={{ mb: 3, textTransform: "none" }}>
                Back
            </Button>

            <Grid container spacing={5}>
                {/* Image */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                        <Box component="img"
                            src={product.image || `https://placehold.co/500x450/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                            sx={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 450 }}
                        />
                    </Paper>
                </Grid>

                {/* Details */}
                <Grid item xs={12} md={7}>
                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                        <Chip label={product.category} sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600 }} />
                        {product.brand && <Chip label={product.brand} variant="outlined" size="small" />}
                        {discount > 0 && <Chip label={`${discount}% OFF`} color="error" size="small" />}
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>SKU: {product.sku}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                        {product.description}
                    </Typography>

                    {/* Price */}
                    <Box display="flex" gap={2} alignItems="center" mb={2}>
                        {product.discountPrice ? (
                            <>
                                <Typography variant="h3" color="error.main" fontWeight="bold">
                                    ${product.discountPrice}
                                </Typography>
                                <Box>
                                    <Typography sx={{ textDecoration: "line-through", color: "#94a3b8", fontSize: 18 }}>
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="caption" color="success.main" fontWeight="bold">
                                        You save ${(product.price - product.discountPrice).toFixed(2)}
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <Typography variant="h3" color="primary.main" fontWeight="bold">
                                ${product.price}
                            </Typography>
                        )}
                    </Box>

                    {/* Stock */}
                    <Typography
                        color={product.stock > 0 ? "success.main" : "error.main"}
                        fontWeight="bold" mb={3} variant="body1"
                    >
                        {product.stock > 0 ? `✓ In Stock — ${product.stock} units available` : "✗ Out of Stock"}
                    </Typography>

                    {/* Qty + Buttons */}
                    {product.stock > 0 && (
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                            <TextField
                                type="number" label="Qty" value={qty}
                                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                                size="small" sx={{ width: 90 }}
                                inputProps={{ min: 1, max: product.stock }}
                            />
                            <Button variant="outlined" size="large" startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                sx={{ textTransform: "none", borderRadius: 2, px: 3 }}>
                                Add to Cart
                            </Button>
                            <Button variant="contained" size="large" onClick={handleBuyNow}
                                sx={{
                                    textTransform: "none", borderRadius: 2, px: 4,
                                    background: "linear-gradient(90deg,#38bdf8,#6366f1)"
                                }}>
                                Buy Now
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity="success" onClose={() => setSnack(false)}>Added to cart!</Alert>
            </Snackbar>
        </Container>
    );
}
