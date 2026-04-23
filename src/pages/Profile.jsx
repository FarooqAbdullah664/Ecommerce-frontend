import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Grid, Paper, Box, TextField,
    Button, Divider, Alert, Chip, Avatar, IconButton,
    Snackbar, CircularProgress
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddCardIcon from "@mui/icons-material/AddCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";
import { saveCard, getMyCards, deleteMyCard } from "../services/cardService";

export default function Profile() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [cardForm, setCardForm] = useState({
        cardHolderName: "", lastFourDigits: "",
        expiryMonth: "", expiryYear: "", cardType: "visa"
    });
    const [showCardForm, setShowCardForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

    useEffect(() => {
        getMyCards()
            .then((d) => setCards(d.cards || []))
            .catch(() => {})
            .finally(() => setLoadingCards(false));
    }, []);

    const handleSaveCard = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await saveCard(cardForm);
            const d = await getMyCards();
            setCards(d.cards || []);
            setShowCardForm(false);
            setCardForm({ cardHolderName: "", lastFourDigits: "", expiryMonth: "", expiryYear: "", cardType: "visa" });
            setSnack({ open: true, msg: "Card saved successfully!", type: "success" });
        } catch (err) {
            setSnack({ open: true, msg: err.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCard = async (id) => {
        try {
            await deleteMyCard(id);
            setCards((prev) => prev.filter((c) => c._id !== id));
            setSnack({ open: true, msg: "Card removed", type: "success" });
        } catch {
            setSnack({ open: true, msg: "Failed to remove card", type: "error" });
        }
    };

    const cardBrands = {
        visa: { color: "#1a1f71", label: "VISA", bg: "linear-gradient(135deg,#1a1f71,#2d3a8c)" },
        mastercard: { color: "#eb001b", label: "MC", bg: "linear-gradient(135deg,#eb001b,#f79e1b)" },
        other: { color: "#334155", label: "CARD", bg: "linear-gradient(135deg,#334155,#475569)" },
    };

    if (!user) return null;

    return (
        <Box sx={{ bgcolor: "#f1f5f9", minHeight: "100vh", py: 5 }}>
            <Container maxWidth="lg">

                {/* ===== HERO BANNER ===== */}
                <Box sx={{
                    background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
                    borderRadius: 5, p: { xs: 3, md: 5 }, mb: 4,
                    display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
                    position: "relative", overflow: "hidden"
                }}>
                    {/* Decorative circle */}
                    <Box sx={{
                        position: "absolute", width: 300, height: 300, borderRadius: "50%",
                        background: "radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)",
                        right: -50, top: -50
                    }} />

                    <Avatar sx={{
                        width: 90, height: 90, fontSize: 36, fontWeight: 800,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        boxShadow: "0 8px 30px rgba(99,102,241,0.5)",
                        border: "4px solid rgba(255,255,255,0.2)"
                    }}>
                        {user.name?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ zIndex: 1 }}>
                        <Typography variant="h4" fontWeight={800} color="white">
                            {user.name}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", mt: 0.5 }}>{user.email}</Typography>
                        <Box display="flex" gap={1} mt={1.5}>
                            <Chip
                                icon={user.role === "admin" ? <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
                                label={user.role === "admin" ? "Administrator" : "Customer"}
                                sx={{
                                    bgcolor: user.role === "admin" ? "#fef3c7" : "#ede9fe",
                                    color: user.role === "admin" ? "#92400e" : "#4c1d95",
                                    fontWeight: 700
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ ml: "auto", zIndex: 1, display: "flex", gap: 2 }}>
                        <Button component={Link} to="/orders" variant="outlined"
                            startIcon={<ShoppingBagIcon />}
                            sx={{
                                borderColor: "rgba(255,255,255,0.3)", color: "white",
                                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" }
                            }}>
                            My Orders
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* ===== LEFT: Account Info ===== */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                            <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
                                <Typography variant="h6" fontWeight={700}>Account Details</Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {[
                                    { icon: <PersonIcon sx={{ color: "#6366f1" }} />, label: "Full Name", value: user.name },
                                    { icon: <EmailIcon sx={{ color: "#6366f1" }} />, label: "Email", value: user.email },
                                    {
                                        icon: <AdminPanelSettingsIcon sx={{ color: "#6366f1" }} />,
                                        label: "Role",
                                        value: user.role,
                                        chip: true
                                    },
                                ].map((item) => (
                                    <Box key={item.label} sx={{
                                        display: "flex", alignItems: "center", gap: 2,
                                        p: 2, borderRadius: 3, mb: 1.5,
                                        bgcolor: "#f8fafc", border: "1px solid #f1f5f9"
                                    }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 2,
                                            bgcolor: "#ede9fe", display: "flex",
                                            alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                {item.label}
                                            </Typography>
                                            {item.chip ? (
                                                <Box>
                                                    <Chip label={item.value} size="small"
                                                        color={item.value === "admin" ? "warning" : "primary"}
                                                        sx={{ fontWeight: 700, mt: 0.3 }} />
                                                </Box>
                                            ) : (
                                                <Typography fontWeight={600} variant="body2">{item.value}</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* ===== RIGHT: Saved Cards ===== */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                            <Box sx={{
                                p: 3, borderBottom: "1px solid #f1f5f9",
                                display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "#ede9fe", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <CreditCardIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Saved Cards</Typography>
                                    <Chip label={cards.length} size="small"
                                        sx={{ bgcolor: "#ede9fe", color: "#6366f1", fontWeight: 700 }} />
                                </Box>
                                <Button variant="contained" startIcon={<AddCardIcon />}
                                    onClick={() => setShowCardForm(!showCardForm)}
                                    sx={{
                                        background: showCardForm
                                            ? "#ef4444"
                                            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                        borderRadius: 3, textTransform: "none", fontWeight: 600
                                    }}>
                                    {showCardForm ? "Cancel" : "Add Card"}
                                </Button>
                            </Box>

                            {/* Add Card Form */}
                            {showCardForm && (
                                <Box sx={{ p: 3, bgcolor: "#fafafe", borderBottom: "1px solid #f1f5f9" }}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={2.5}>
                                        💳 Add New Card
                                    </Typography>
                                    <Box component="form" onSubmit={handleSaveCard}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField label="Card Holder Name"
                                                    value={cardForm.cardHolderName}
                                                    onChange={(e) => setCardForm({ ...cardForm, cardHolderName: e.target.value })}
                                                    required fullWidth size="small"
                                                    placeholder="John Doe"
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField label="Last 4 Digits"
                                                    value={cardForm.lastFourDigits}
                                                    onChange={(e) => setCardForm({ ...cardForm, lastFourDigits: e.target.value.replace(/\D/, "").slice(0, 4) })}
                                                    required fullWidth size="small"
                                                    placeholder="1234"
                                                    inputProps={{ maxLength: 4 }}
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }} />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField label="Month"
                                                    value={cardForm.expiryMonth}
                                                    onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value.slice(0, 2) })}
                                                    required fullWidth size="small" placeholder="MM"
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }} />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField label="Year"
                                                    value={cardForm.expiryYear}
                                                    onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value.slice(0, 2) })}
                                                    required fullWidth size="small" placeholder="YY"
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField label="Card Type" value={cardForm.cardType}
                                                    onChange={(e) => setCardForm({ ...cardForm, cardType: e.target.value })}
                                                    fullWidth size="small" select
                                                    SelectProps={{ native: true }}
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }}>
                                                    <option value="visa">Visa</option>
                                                    <option value="mastercard">Mastercard</option>
                                                    <option value="other">Other</option>
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Button type="submit" variant="contained" disabled={saving}
                                            sx={{
                                                mt: 2.5, borderRadius: 3, px: 4, fontWeight: 700,
                                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                            }}>
                                            {saving ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save Card"}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Cards List */}
                            <Box sx={{ p: 3 }}>
                                {loadingCards ? (
                                    <Box display="flex" justifyContent="center" py={4}>
                                        <CircularProgress size={30} />
                                    </Box>
                                ) : cards.length === 0 ? (
                                    <Box textAlign="center" py={5}>
                                        <Typography sx={{ fontSize: 60, mb: 2 }}>💳</Typography>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>No saved cards</Typography>
                                        <Typography color="text.secondary" mb={3}>
                                            Add a card for faster checkout
                                        </Typography>
                                        <Button variant="outlined" startIcon={<AddCardIcon />}
                                            onClick={() => setShowCardForm(true)}
                                            sx={{ borderRadius: 3, color: "#6366f1", borderColor: "#6366f1" }}>
                                            Add Your First Card
                                        </Button>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2.5}>
                                        {cards.map((c) => {
                                            const brand = cardBrands[c.cardType] || cardBrands.other;
                                            return (
                                                <Grid item xs={12} sm={6} key={c._id}>
                                                    <Box sx={{
                                                        background: brand.bg,
                                                        borderRadius: 4, p: 3, color: "white",
                                                        position: "relative", minHeight: 160,
                                                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                                        transition: "transform 0.2s",
                                                        "&:hover": { transform: "translateY(-4px)" }
                                                    }}>
                                                        {/* Delete btn */}
                                                        <IconButton size="small"
                                                            onClick={() => handleDeleteCard(c._id)}
                                                            sx={{
                                                                position: "absolute", top: 10, right: 10,
                                                                color: "rgba(255,255,255,0.7)",
                                                                "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.15)" }
                                                            }}>
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>

                                                        {/* Card Type */}
                                                        <Typography variant="caption"
                                                            sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 2 }}>
                                                            {brand.label}
                                                        </Typography>

                                                        {/* Card Number */}
                                                        <Typography variant="h6" letterSpacing={3} mt={2} mb={2}
                                                            sx={{ fontFamily: "monospace" }}>
                                                            •••• •••• •••• {c.lastFourDigits}
                                                        </Typography>

                                                        <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                                                            <Box>
                                                                <Typography variant="caption" sx={{ opacity: 0.7, display: "block" }}>
                                                                    CARD HOLDER
                                                                </Typography>
                                                                <Typography fontWeight={700} variant="body2">
                                                                    {c.cardHolderName}
                                                                </Typography>
                                                            </Box>
                                                            <Box textAlign="right">
                                                                <Typography variant="caption" sx={{ opacity: 0.7, display: "block" }}>
                                                                    EXPIRES
                                                                </Typography>
                                                                <Typography fontWeight={700} variant="body2">
                                                                    {c.expiryMonth}/{c.expiryYear}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={snack.open} autoHideDuration={3000}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity={snack.type} onClose={() => setSnack({ ...snack, open: false })}
                    sx={{ borderRadius: 3 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
