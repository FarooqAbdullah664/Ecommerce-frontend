import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Container, Grid, Card, CardMedia, CardContent, CardActions,
    Typography, Button, TextField, Box, Chip, MenuItem, Select,
    FormControl, InputLabel, CircularProgress, Pagination, InputAdornment, Snackbar, Alert
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

const categories = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [snack, setSnack] = useState(false);
    const { addToCart } = useCart();

    const fetchProducts = useCallback(() => {
        setLoading(true);
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category !== "All") params.category = category;
        getProducts(params)
            .then((d) => { setProducts(d.products || []); setPages(d.pages || 1); setTotal(d.total || 0); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, category]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleAddToCart = (p) => {
        addToCart(p);
        setSnack(true);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>All Products</Typography>
            <Typography color="text.secondary" mb={3}>{total} products found</Typography>

            {/* Filters */}
            <Box component="form" onSubmit={handleSearch} display="flex" gap={2} mb={4} flexWrap="wrap" alignItems="center">
                <TextField
                    label="Search products..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small" sx={{ minWidth: 280 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} label="Category"
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                        {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" sx={{ textTransform: "none" }}>Search</Button>
                {(search || category !== "All") && (
                    <Button variant="outlined" onClick={() => { setSearch(""); setCategory("All"); setPage(1); }}
                        sx={{ textTransform: "none" }}>
                        Clear
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={10}><CircularProgress size={50} /></Box>
            ) : products.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Typography variant="h6" color="text.secondary">No products found</Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {products.map((p) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
                                <Card sx={{
                                    height: "100%", display: "flex", flexDirection: "column",
                                    borderRadius: 3, boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
                                    transition: "all 0.25s ease",
                                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }
                                }}>
                                    <Box sx={{ position: "relative" }}>
                                        <CardMedia component="img" height="200"
                                            image={p.image || `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(p.name)}`}
                                            alt={p.name} sx={{ objectFit: "cover" }} />
                                        {p.discountPrice && (
                                            <Chip label={`${Math.round((1 - p.discountPrice / p.price) * 100)}% OFF`}
                                                color="error" size="small"
                                                sx={{ position: "absolute", top: 10, right: 10 }} />
                                        )}
                                        {p.stock === 0 && (
                                            <Box sx={{
                                                position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)",
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Chip label="Out of Stock" color="error" />
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Chip label={p.category} size="small"
                                            sx={{ mb: 1, bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600 }} />
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap title={p.name}>
                                            {p.name}
                                        </Typography>
                                        {p.brand && (
                                            <Typography variant="caption" color="text.secondary">by {p.brand}</Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            mt: 0.5, overflow: "hidden", display: "-webkit-box",
                                            WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                                        }}>{p.description}</Typography>
                                        <Box display="flex" gap={1} alignItems="center" mt={1}>
                                            {p.discountPrice ? (
                                                <>
                                                    <Typography color="error.main" fontWeight="bold" variant="h6">
                                                        ${p.discountPrice}
                                                    </Typography>
                                                    <Typography sx={{ textDecoration: "line-through", color: "#94a3b8", fontSize: 13 }}>
                                                        ${p.price}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography color="primary.main" fontWeight="bold" variant="h6">
                                                    ${p.price}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography variant="caption" color={p.stock > 0 ? "success.main" : "error.main"} fontWeight={600}>
                                            {p.stock > 0 ? `✓ In Stock (${p.stock})` : "✗ Out of Stock"}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                        <Button component={Link} to={`/products/${p._id}`} size="small"
                                            variant="outlined" fullWidth sx={{ textTransform: "none", borderRadius: 2 }}>
                                            Details
                                        </Button>
                                        <Button size="small" variant="contained" fullWidth
                                            disabled={p.stock === 0}
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={() => handleAddToCart(p)}
                                            sx={{
                                                textTransform: "none", borderRadius: 2,
                                                background: "linear-gradient(90deg,#38bdf8,#6366f1)"
                                            }}>
                                            Add
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={5}>
                            <Pagination count={pages} page={page} onChange={(_, v) => setPage(v)}
                                color="primary" size="large" />
                        </Box>
                    )}
                </>
            )}

            <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity="success" onClose={() => setSnack(false)}>Added to cart!</Alert>
            </Snackbar>
        </Container>
    );
}
