
import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, TextField, Box, Chip, MenuItem, Select, FormControl, InputLabel, Pagination, Snackbar, Alert, Container, Skeleton, IconButton, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

const categories = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"];
const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "discount", label: "Best Deals" },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("default");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [snack, setSnack] = useState({ open: false, name: "" });
    const [wishlist, setWishlist] = useState([]);
    const { addToCart } = useCart();

    // Read category from URL query params
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat && categories.includes(cat)) {
            setCategory(cat);
        }
    }, [searchParams]);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category !== "All") params.category = category;
        getProducts(params).then((d) => {
            let prods = d.products || [];
            if (sort === "price_asc") prods = [...prods].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
            if (sort === "price_desc") prods = [...prods].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
            if (sort === "discount") prods = [...prods].sort((a, b) => { const da = a.discountPrice ? Math.round((1 - a.discountPrice / a.price) * 100) : 0; const db = b.discountPrice ? Math.round((1 - b.discountPrice / b.price) * 100) : 0; return db - da; });
            setProducts(prods); setPages(d.pages || 1); setTotal(d.total || 0);
        }).catch(() => {}).finally(() => setLoading(false));
    }, [page, category, sort]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };
    const handleAddToCart = (p) => { addToCart(p); setSnack({ open: true, name: p.name }); };
    const toggleWishlist = (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    return (
        <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh" }}>

            {/* HERO */}
            <Box sx={{ bgcolor: "#1B2B4B", py: { xs: 7, md: 9 }, position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,107,107,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box textAlign="center" mb={5}>
                        <Typography variant="overline" sx={{ color: "#FF6B6B", fontWeight: 700, letterSpacing: 2 }}>OUR COLLECTION</Typography>
                        <Typography variant="h2" fontWeight={800} color="white" sx={{ fontSize: { xs: "2.2rem", md: "3.5rem" }, letterSpacing: "-1px", mt: 1, mb: 1.5 }}>All Products</Typography>
                        <Typography sx={{ color: "#94a3b8" }}>{total > 0 ? `${total} products available` : "Discover our collection"}</Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, maxWidth: 560, mx: "auto" }}>
                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, px: 2, gap: 1, "&:focus-within": { border: "1px solid rgba(255,107,107,0.5)", bgcolor: "rgba(255,255,255,0.1)" }, transition: "all 0.2s" }}>
                            <SearchIcon sx={{ color: "#94a3b8", flexShrink: 0, fontSize: 20 }} />
                            <TextField variant="standard" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} fullWidth InputProps={{ disableUnderline: true, sx: { color: "white", py: 1.1, "& ::placeholder": { color: "#64748b" } } }} />
                        </Box>
                        <Button type="submit" variant="contained" sx={{ px: 3.5, borderRadius: 2, fontWeight: 600, bgcolor: "#FF6B6B", "&:hover": { bgcolor: "#ff5252" }, boxShadow: "0 4px 15px rgba(255,107,107,0.35)" }}>Search</Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 5 }}>
                {/* Filters */}
                <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    <Box display="flex" gap={1.5} flexWrap="wrap">
                        {categories.map((c) => (
                            <Chip key={c} label={c} onClick={() => { setCategory(c); setPage(1); }}
                                sx={{ fontWeight: 600, cursor: "pointer", borderRadius: 2, height: 34, bgcolor: category === c ? "#1B2B4B" : "white", color: category === c ? "white" : "#6B7280", border: `1px solid ${category === c ? "#1B2B4B" : "#E5E7EB"}`, transition: "all 0.2s", "&:hover": { bgcolor: category === c ? "#0f1c33" : "#F8F9FA", borderColor: "#1B2B4B" } }}
                            />
                        ))}
                        {(search || category !== "All") && (
                            <Chip label="Clear" onClick={() => { setSearch(""); setCategory("All"); setPage(1); }} sx={{ fontWeight: 600, cursor: "pointer", borderRadius: 2, height: 34, bgcolor: "#fff5f5", color: "#FF6B6B", border: "1px solid #fecaca" }} />
                        )}
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 170 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)} sx={{ borderRadius: 2, bgcolor: "white" }}>
                            {sortOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                {!loading && <Typography color="text.secondary" variant="body2" mb={3}><b style={{ color: "#1B2B4B" }}>{products.length}</b> of <b>{total}</b> products</Typography>}

                {loading ? (
                    <Grid container spacing={3}>
                        {[...Array(12)].map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <Card><Skeleton variant="rectangular" height={230} /><CardContent><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="80%" /><Skeleton variant="text" width="35%" height={30} sx={{ mt: 1 }} /></CardContent></Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : products.length === 0 ? (
                    <Box textAlign="center" py={12}>
                        <Typography sx={{ fontSize: 80, mb: 2 }}>🔍</Typography>
                        <Typography variant="h5" fontWeight={700} color="#1B2B4B" gutterBottom>No products found</Typography>
                        <Button variant="contained" onClick={() => { setSearch(""); setCategory("All"); }} sx={{ mt: 2, bgcolor: "#1B2B4B" }}>Browse All</Button>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {products.map((p) => {
                                const discount = p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
                                const isWishlisted = wishlist.includes(p._id);
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
                                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", "&:hover": { transform: "translateY(-8px)", boxShadow: "0 20px 50px rgba(27,43,75,0.12)", borderColor: "#1B2B4B", "& .overlay-btns": { opacity: 1, transform: "translateY(0)" }, "& .pimg": { transform: "scale(1.06)" } } }}>
                                            <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#F8F9FA" }}>
                                                <Box className="pimg" component="img" src={p.image || `https://placehold.co/400x230/EEF2FF/1B2B4B?text=${encodeURIComponent(p.name)}`} alt={p.name} sx={{ width: "100%", height: 230, objectFit: "cover", display: "block", transition: "transform 0.4s" }} />
                                                {discount > 0 && <Box sx={{ position: "absolute", top: 10, left: 10, bgcolor: "#FF6B6B", color: "white", px: 1.5, py: 0.4, borderRadius: 1.5, fontSize: 12, fontWeight: 700 }}>-{discount}%</Box>}
                                                {p.stock === 0 && <Box sx={{ position: "absolute", top: 10, left: 10, bgcolor: "#1B2B4B", color: "white", px: 1.5, py: 0.4, borderRadius: 1.5, fontSize: 11, fontWeight: 700 }}>Sold Out</Box>}
                                                <Tooltip title={isWishlisted ? "Remove" : "Wishlist"}>
                                                    <IconButton onClick={() => toggleWishlist(p._id)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", width: 34, height: 34, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#fff5f5" } }}>
                                                        {isWishlisted ? <FavoriteIcon sx={{ fontSize: 16, color: "#FF6B6B" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Box className="overlay-btns" sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 1.5, display: "flex", gap: 1, background: "linear-gradient(to top,rgba(27,43,75,0.8),transparent)", opacity: 0, transform: "translateY(8px)", transition: "all 0.25s" }}>
                                                    <Button component={Link} to={`/products/${p._id}`} startIcon={<VisibilityIcon sx={{ fontSize: "14px !important" }} />} size="small" fullWidth sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", borderRadius: 2, border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600, fontSize: 12, backdropFilter: "blur(8px)" }}>View</Button>
                                                    <Button startIcon={<ShoppingCartIcon sx={{ fontSize: "14px !important" }} />} size="small" fullWidth disabled={p.stock === 0} onClick={() => handleAddToCart(p)} sx={{ bgcolor: "#FF6B6B", color: "white", borderRadius: 2, fontWeight: 700, fontSize: 12, "&:hover": { bgcolor: "#ff5252" } }}>Add</Button>
                                                </Box>
                                                {p.stock === 0 && <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontWeight={700} color="white">Out of Stock</Typography></Box>}
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1 }}>
                                                <Chip label={p.category} size="small" sx={{ mb: 1.5, bgcolor: "#EEF2FF", color: "#1B2B4B", fontWeight: 600, fontSize: 11 }} />
                                                <Typography variant="subtitle1" fontWeight={700} color="#1B2B4B" sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4, mb: 0.5 }}>{p.name}</Typography>
                                                {p.brand && <Typography variant="caption" color="text.secondary">by {p.brand}</Typography>}
                                                <Box display="flex" gap={1} alignItems="center" mt={1}>
                                                    {p.discountPrice ? (
                                                        <><Typography color="#FF6B6B" fontWeight={800} variant="h6">${p.discountPrice}</Typography><Typography sx={{ textDecoration: "line-through", color: "#9CA3AF", fontSize: 13 }}>${p.price}</Typography></>
                                                    ) : (
                                                        <Typography color="#1B2B4B" fontWeight={800} variant="h6">${p.price}</Typography>
                                                    )}
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.8} mt={0.8}>
                                                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: p.stock > 5 ? "#10b981" : p.stock > 0 ? "#f59e0b" : "#ef4444" }} />
                                                    <Typography variant="caption" fontWeight={600} color={p.stock > 5 ? "success.main" : p.stock > 0 ? "warning.main" : "error.main"}>{p.stock > 5 ? "In Stock" : p.stock > 0 ? `Only ${p.stock} left` : "Out of Stock"}</Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1 }}>
                                                <Button component={Link} to={`/products/${p._id}`} size="small" variant="outlined" fullWidth sx={{ borderRadius: 2, borderColor: "#E5E7EB", color: "#6B7280", "&:hover": { borderColor: "#1B2B4B", color: "#1B2B4B" } }}>Details</Button>
                                                <Button size="small" variant="contained" fullWidth disabled={p.stock === 0} startIcon={<ShoppingCartIcon sx={{ fontSize: "14px !important" }} />} onClick={() => handleAddToCart(p)} sx={{ borderRadius: 2, bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" } }}>{p.stock === 0 ? "Sold Out" : "Add"}</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        {pages > 1 && (
                            <Box display="flex" justifyContent="center" mt={6}>
                                <Pagination count={pages} page={page} onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }} color="primary" size="large" sx={{ "& .MuiPaginationItem-root": { borderRadius: 2, fontWeight: 600, border: "1px solid #E5E7EB", bgcolor: "white" }, "& .Mui-selected": { bgcolor: "#1B2B4B !important", color: "white", border: "none" } }} />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity="success" onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2, fontWeight: 600 }}>✓ <b>{snack.name}</b> added to cart!</Alert>
            </Snackbar>
        </Box>
    );
}
