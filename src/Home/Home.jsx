
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button, Box, Grid, Card, CardContent, CardActions, Chip, Container, Skeleton, Divider, Avatar } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

const features = [
    { icon: <LocalShippingIcon />, title: "Free Shipping", desc: "On orders over $50" },
    { icon: <SecurityIcon />, title: "Secure Payment", desc: "100% protected" },
    { icon: <AutorenewIcon />, title: "Easy Returns", desc: "30 day policy" },
    { icon: <SupportAgentIcon />, title: "24/7 Support", desc: "Always here" },
];

const categories = [
    { name: "Electronics", emoji: "💻" },
    { name: "Clothing", emoji: "👕" },
    { name: "Books", emoji: "📚" },
    { name: "Home", emoji: "🏠" },
    { name: "Sports", emoji: "⚽" },
    { name: "Beauty", emoji: "💄" },
];

const testimonials = [
    { name: "Sarah Johnson", role: "Verified Buyer", review: "Amazing quality and fast delivery. The packaging was perfect and customer service was excellent.", rating: 5, avatar: "S" },
    { name: "Mike Chen", role: "Regular Customer", review: "Best online shopping experience. Product quality exceeded my expectations completely.", rating: 5, avatar: "M" },
    { name: "Emma Davis", role: "Verified Buyer", review: "Great prices and super fast shipping. Will definitely shop here again and again.", rating: 4, avatar: "E" },
];

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        getProducts({ limit: 8 }).then((d) => setFeatured(d.products || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ bgcolor: "#F8F9FA" }}>

            {/* ===== HERO ===== */}
            <Box sx={{ bgcolor: "#1B2B4B", py: { xs: 7, sm: 9, md: 14 }, position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,107,107,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center" }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, px: 2, py: 0.7, mb: { xs: 2, md: 4 } }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#FF6B6B", flexShrink: 0 }} />
                            <Typography variant="caption" sx={{ color: "#FF6B6B", fontWeight: 700, letterSpacing: 1, fontSize: { xs: 10, md: 11 } }}>
                                NEW ARRIVALS — UP TO 50% OFF
                            </Typography>
                        </Box>

                        <Typography sx={{ fontSize: { xs: "1.5rem", sm: "2.2rem", md: "5rem" }, fontWeight: 800, lineHeight: 1.15, mb: { xs: 1.5, md: 3 }, letterSpacing: { xs: "-0.5px", md: "-1.5px" }, color: "white" }}>
                            Discover
                            <Box component="span" sx={{ color: "#FF6B6B" }}> Premium</Box>
                            <Box component="span" sx={{ display: "block" }}>Products</Box>
                        </Typography>

                        <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.1rem" }, mb: { xs: 2.5, md: 5 }, lineHeight: 1.7, maxWidth: 500, mx: "auto" }}>
                            Curated collection from top brands. Quality guaranteed, prices unmatched.
                        </Typography>

                        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={{ xs: 4, md: 8 }}>
                            <Button component={Link} to="/products" variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                                sx={{ bgcolor: "#FF6B6B", color: "white", px: { xs: 3, md: 5 }, py: { xs: 1.2, md: 1.6 }, fontSize: { xs: "0.85rem", md: "0.95rem" }, fontWeight: 700, borderRadius: 2, boxShadow: "0 8px 25px rgba(255,107,107,0.4)", "&:hover": { bgcolor: "#ff5252" } }}>
                                Shop Now
                            </Button>
                            <Button component={Link} to="/signup" variant="outlined" size="large"
                                sx={{ borderColor: "rgba(255,255,255,0.25)", color: "white", px: { xs: 3, md: 5 }, py: { xs: 1.2, md: 1.6 }, fontSize: { xs: "0.85rem", md: "0.95rem" }, borderRadius: 2, "&:hover": { borderColor: "rgba(255,255,255,0.6)", bgcolor: "rgba(255,255,255,0.05)" } }}>
                                Join Free
                            </Button>
                        </Box>

                        <Box display="flex" gap={{ xs: 3, md: 6 }} justifyContent="center">
                            {[["50K+", "Customers"], ["10K+", "Products"], ["4.9★", "Rating"]].map(([val, label]) => (
                                <Box key={label} textAlign="center">
                                    <Typography sx={{ fontSize: { xs: "1.3rem", md: "1.8rem" }, fontWeight: 800, color: "white", lineHeight: 1 }}>{val}</Typography>
                                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: { xs: 10, md: 12 } }}>{label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ===== FEATURES ===== */}
            <Box sx={{ bgcolor: "white", py: { xs: 3, md: 5 }, borderBottom: "1px solid #E5E7EB" }}>
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={{ xs: 1.5, md: 2 }} justifyContent="center">
                        {features.map((f) => (
                            <Grid item xs={6} sm={6} md={3} key={f.title}>
                                <Box sx={{
                                    display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 },
                                    p: { xs: 1.5, md: 2.5 }, borderRadius: 3,
                                    border: "1px solid #E5E7EB", bgcolor: "white",
                                    transition: "all 0.2s",
                                    "&:hover": { borderColor: "#1B2B4B", transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(27,43,75,0.1)" }
                                }}>
                                    <Box sx={{
                                        width: { xs: 40, md: 52 }, height: { xs: 40, md: 52 }, borderRadius: 3,
                                        bgcolor: "#EEF2FF", color: "#1B2B4B",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                    }}>
                                        {f.icon}
                                    </Box>
                                    <Box>
                                        <Typography fontWeight={700} variant="body2" color="#1B2B4B" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{f.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}>{f.desc}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ===== CATEGORIES ===== */}
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 }, px: { xs: 2, sm: 3 } }}>
                <Box textAlign="center" mb={{ xs: 3, md: 6 }}>
                    <Typography variant="overline" sx={{ color: "#FF6B6B", fontWeight: 700, letterSpacing: 2 }}>BROWSE</Typography>
                    <Typography variant="h3" fontWeight={800} color="#1B2B4B" mt={0.5} sx={{ fontSize: { xs: "1.8rem", md: "3rem" } }}>Shop by Category</Typography>
                </Box>
                <Grid container spacing={{ xs: 1.5, md: 2.5 }} justifyContent="center">
                    {categories.map((c) => (
                        <Grid item xs={4} sm={4} md={2} key={c.name}>
                            <Box onClick={() => navigate(`/products?category=${c.name}`)}
                                sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: { xs: 2.5, md: 4 }, px: { xs: 1, md: 2 }, borderRadius: 4, bgcolor: "white", border: "1px solid #E5E7EB", transition: "all 0.25s", cursor: "pointer", "&:hover": { transform: "translateY(-8px)", borderColor: "#1B2B4B", boxShadow: "0 16px 40px rgba(27,43,75,0.12)" } }}>
                                <Typography sx={{ fontSize: { xs: 28, md: 42 }, mb: 1 }}>{c.emoji}</Typography>
                                <Typography fontWeight={700} color="#1B2B4B" sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}>{c.name}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ===== FEATURED PRODUCTS ===== */}
            <Box sx={{ bgcolor: "white", py: { xs: 5, md: 9 } }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={{ xs: 3, md: 6 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: "#FF6B6B", fontWeight: 700, letterSpacing: 2 }}>TRENDING</Typography>
                            <Typography fontWeight={800} color="#1B2B4B" mt={0.5} sx={{ fontSize: { xs: "1.5rem", md: "3rem" } }}>Featured Products</Typography>
                        </Box>
                        <Button component={Link} to="/products" endIcon={<ArrowForwardIcon />} sx={{ color: "#1B2B4B", fontWeight: 600, display: { xs: "none", sm: "flex" }, "&:hover": { bgcolor: "#F8F9FA" } }}>View All</Button>
                    </Box>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {loading ? [...Array(8)].map((_, i) => (
                            <Grid item xs={6} sm={6} md={3} key={i}>
                                <Card><Skeleton variant="rectangular" height={180} /><CardContent><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="80%" /></CardContent></Card>
                            </Grid>
                        )) : featured.length === 0 ? (
                            <Grid item xs={12}><Box textAlign="center" py={8}><Typography sx={{ fontSize: 70, mb: 2 }}>🛒</Typography><Typography color="text.secondary">No products yet.</Typography></Box></Grid>
                        ) : featured.map((p) => {
                            const discount = p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
                            return (
                                <Grid item xs={6} sm={6} md={3} key={p._id}>
                                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 50px rgba(27,43,75,0.12)", "& .pimg": { transform: "scale(1.06)" } } }}>
                                        <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#F8F9FA" }}>
                                            <Box className="pimg" component="img" src={p.image || `https://placehold.co/300x200/EEF2FF/1B2B4B?text=${encodeURIComponent(p.name)}`} alt={p.name} sx={{ width: "100%", height: { xs: 150, sm: 180, md: 220 }, objectFit: "cover", display: "block", transition: "transform 0.4s" }} />
                                            {discount > 0 && <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#FF6B6B", color: "white", px: 1, py: 0.3, borderRadius: 1.5, fontSize: 11, fontWeight: 700 }}>-{discount}%</Box>}
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2.5 }, pb: 1 }}>
                                            <Chip label={p.category} size="small" sx={{ mb: 1, bgcolor: "#EEF2FF", color: "#1B2B4B", fontWeight: 600, fontSize: 10 }} />
                                            <Typography fontWeight={700} color="#1B2B4B" sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.name}</Typography>
                                            <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                                                {p.discountPrice ? (
                                                    <><Typography color="#FF6B6B" fontWeight={800} sx={{ fontSize: { xs: "0.9rem", md: "1.25rem" } }}>${p.discountPrice}</Typography><Typography sx={{ textDecoration: "line-through", color: "#9CA3AF", fontSize: { xs: 10, md: 13 } }}>${p.price}</Typography></>
                                                ) : (
                                                    <Typography color="#1B2B4B" fontWeight={800} sx={{ fontSize: { xs: "0.9rem", md: "1.25rem" } }}>${p.price}</Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ px: { xs: 1.5, md: 2.5 }, pb: { xs: 1.5, md: 2.5 }, pt: 1, gap: 1 }}>
                                            <Button component={Link} to={`/products/${p._id}`} size="small" variant="outlined" fullWidth sx={{ borderRadius: 2, borderColor: "#E5E7EB", color: "#6B7280", fontSize: { xs: "0.7rem", md: "0.8rem" }, "&:hover": { borderColor: "#1B2B4B", color: "#1B2B4B" } }}>Details</Button>
                                            <Button size="small" variant="contained" fullWidth disabled={p.stock === 0} onClick={() => addToCart(p)} sx={{ borderRadius: 2, bgcolor: "#1B2B4B", fontSize: { xs: "0.7rem", md: "0.8rem" }, "&:hover": { bgcolor: "#0f1c33" } }}>{p.stock === 0 ? "Sold Out" : "Add"}</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Container>
            </Box>

            {/* ===== TESTIMONIALS ===== */}
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 }, px: { xs: 2, sm: 3 } }}>
                <Box textAlign="center" mb={{ xs: 3, md: 6 }}>
                    <Typography variant="overline" sx={{ color: "#FF6B6B", fontWeight: 700, letterSpacing: 2 }}>REVIEWS</Typography>
                    <Typography fontWeight={800} color="#1B2B4B" mt={0.5} sx={{ fontSize: { xs: "1.8rem", md: "3rem" } }}>What Customers Say</Typography>
                </Box>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {testimonials.map((t) => (
                        <Grid item xs={12} sm={6} md={4} key={t.name}>
                            <Box sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, bgcolor: "white", border: "1px solid #E5E7EB", height: "100%", transition: "all 0.25s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 40px rgba(27,43,75,0.1)", borderColor: "#1B2B4B" } }}>
                                <Box display="flex" gap={0.3} mb={2}>{[...Array(t.rating)].map((_, i) => <StarIcon key={i} sx={{ color: "#FF6B6B", fontSize: 16 }} />)}</Box>
                                <Typography variant="body2" color="text.secondary" mb={2.5} lineHeight={1.8} sx={{ fontStyle: "italic" }}>"{t.review}"</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#1B2B4B", fontWeight: 700, fontSize: 14 }}>{t.avatar}</Avatar>
                                    <Box><Typography fontWeight={700} color="#1B2B4B" variant="body2">{t.name}</Typography><Typography variant="caption" color="text.secondary">{t.role}</Typography></Box>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ===== CTA ===== */}
            <Box sx={{ bgcolor: "#1B2B4B", py: { xs: 6, md: 10 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,107,107,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}>
                    <Typography fontWeight={800} color="white" gutterBottom sx={{ fontSize: { xs: "1.6rem", md: "3rem" } }}>Ready to Start Shopping?</Typography>
                    <Typography sx={{ color: "#94a3b8", mb: { xs: 3, md: 5 }, fontSize: { xs: "0.9rem", md: "1.05rem" } }}>Join 50,000+ happy customers today</Typography>
                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <Button component={Link} to="/signup" size="large" variant="contained"
                            sx={{ bgcolor: "#FF6B6B", color: "white", px: { xs: 3, md: 5 }, py: { xs: 1.2, md: 1.6 }, fontWeight: 700, borderRadius: 2, boxShadow: "0 8px 25px rgba(255,107,107,0.4)", "&:hover": { bgcolor: "#ff5252" } }}>
                            Create Free Account
                        </Button>
                        <Button component={Link} to="/products" size="large" variant="outlined"
                            sx={{ borderColor: "rgba(255,255,255,0.3)", color: "white", px: { xs: 3, md: 5 }, py: { xs: 1.2, md: 1.6 }, borderRadius: 2, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)" } }}>
                            Browse Products
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ===== FOOTER ===== */}
            <Box sx={{ bgcolor: "#0f1c33", color: "#94a3b8", pt: { xs: 5, md: 8 }, pb: 4 }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={{ xs: 3, md: 5 }} mb={{ xs: 4, md: 6 }}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Typography variant="h5" fontWeight={800} mb={2} color="white">
                                Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                            </Typography>
                            <Typography variant="body2" lineHeight={2} mb={3} sx={{ color: "#64748b", maxWidth: 260 }}>Your premium destination for quality products. Excellence with every order.</Typography>
                            <Box display="flex" gap={1.5}>
                                {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                                    <Box key={i} sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#1B2B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, transition: "all 0.2s", "&:hover": { bgcolor: "#FF6B6B", transform: "translateY(-3px)" } }}>{icon}</Box>
                                ))}
                            </Box>
                        </Grid>
                        {[
                            { title: "Shop", links: ["All Products", "Electronics", "Clothing", "Sports", "Beauty"] },
                            { title: "Account", links: ["Login", "Register", "My Orders", "My Profile"] },
                            { title: "Support", links: ["Help Center", "Contact Us", "Returns", "Privacy Policy"] },
                        ].map((col) => (
                            <Grid item xs={4} sm={4} md={2.5} key={col.title}>
                                <Typography fontWeight={700} color="white" mb={2} variant="body2">{col.title}</Typography>
                                {col.links.map((l) => (<Typography key={l} variant="caption" sx={{ mb: 1, display: "block", cursor: "pointer", color: "#64748b", transition: "all 0.2s", "&:hover": { color: "#FF6B6B" } }}>{l}</Typography>))}
                            </Grid>
                        ))}
                    </Grid>
                    <Divider sx={{ borderColor: "#1B2B4B", mb: 3 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Typography variant="caption" sx={{ color: "#374151" }}>© 2026 ShopZone. All rights reserved.</Typography>
                        <Box display="flex" gap={1}>{["💳", "🏦", "📱", "🔒"].map((icon, i) => (<Box key={i} sx={{ px: 1.5, py: 0.6, bgcolor: "#1B2B4B", borderRadius: 1.5, fontSize: 14 }}>{icon}</Box>))}</Box>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
}
