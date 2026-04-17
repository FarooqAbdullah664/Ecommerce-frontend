import { useState } from "react";
import {
    Container, Typography, Grid, Paper, Box, TextField,
    Button, Divider, Alert, Chip, Avatar
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useAuth } from "../context/AuthContext";
import { saveCard, getMyCards, deleteMyCard } from "../services/cardService";
import { useEffect } from "react";

export default function Profile() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [cardForm, setCardForm] = useState({
        cardHolderName: "", lastFourDigits: "", expiryMonth: "", expiryYear: "", cardType: "visa"
    });
    const [cardMsg, setCardMsg] = useState({ type: "", text: "" });
    const [showCardForm, setShowCardForm] = useState(false);

    useEffect(() => {
        getMyCards().then((d) => setCards(d.cards || [])).catch(() => {});
    }, []);

    const handleSaveCard = async (e) => {
        e.preventDefault();
        try {
            await saveCard(cardForm);
            setCardMsg({ type: "success", text: "Card saved successfully!" });
            setShowCardForm(false);
            setCardForm({ cardHolderName: "", lastFourDigits: "", expiryMonth: "", expiryYear: "", cardType: "visa" });
            const d = await getMyCards();
            setCards(d.cards || []);
        } catch (err) {
            setCardMsg({ type: "error", text: err.message });
        }
    };

    const handleDeleteCard = async (id) => {
        await deleteMyCard(id);
        setCards((prev) => prev.filter((c) => c._id !== id));
    };

    if (!user) return null;

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>My Profile</Typography>

            {/* User Info */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <Box display="flex" alignItems="center" gap={3} mb={3}>
                    <Avatar sx={{ width: 70, height: 70, bgcolor: "#6366f1", fontSize: 28 }}>
                        {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
                        <Typography color="text.secondary">{user.email}</Typography>
                        <Chip
                            label={user.role === "admin" ? "Admin" : "Customer"}
                            color={user.role === "admin" ? "warning" : "primary"}
                            size="small" sx={{ mt: 0.5 }}
                        />
                    </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Full Name" value={user.name} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Email" value={user.email} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Role" value={user.role} fullWidth disabled />
                    </Grid>
                </Grid>
            </Paper>

            {/* Saved Cards */}
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CreditCardIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Saved Cards</Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => setShowCardForm(!showCardForm)}>
                        {showCardForm ? "Cancel" : "+ Add Card"}
                    </Button>
                </Box>

                {cardMsg.text && (
                    <Alert severity={cardMsg.type} sx={{ mb: 2 }} onClose={() => setCardMsg({ type: "", text: "" })}>
                        {cardMsg.text}
                    </Alert>
                )}

                {/* Add Card Form */}
                {showCardForm && (
                    <Box component="form" onSubmit={handleSaveCard} sx={{ mb: 3, p: 3, bgcolor: "#f8fafc", borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>Add New Card</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label="Card Holder Name" value={cardForm.cardHolderName}
                                    onChange={(e) => setCardForm({ ...cardForm, cardHolderName: e.target.value })}
                                    required fullWidth size="small" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Last 4 Digits" value={cardForm.lastFourDigits}
                                    onChange={(e) => setCardForm({ ...cardForm, lastFourDigits: e.target.value.slice(0, 4) })}
                                    required fullWidth size="small" inputProps={{ maxLength: 4 }} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField label="Expiry Month (MM)" value={cardForm.expiryMonth}
                                    onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value })}
                                    required fullWidth size="small" placeholder="12" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField label="Expiry Year (YY)" value={cardForm.expiryYear}
                                    onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value })}
                                    required fullWidth size="small" placeholder="27" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Card Type" value={cardForm.cardType} select
                                    onChange={(e) => setCardForm({ ...cardForm, cardType: e.target.value })}
                                    fullWidth size="small" SelectProps={{ native: true }}>
                                    <option value="visa">Visa</option>
                                    <option value="mastercard">Mastercard</option>
                                    <option value="other">Other</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Card</Button>
                    </Box>
                )}

                {/* Cards List */}
                {cards.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={3}>No saved cards yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {cards.map((c) => (
                            <Grid item xs={12} sm={6} key={c._id}>
                                <Box sx={{
                                    background: "linear-gradient(135deg, #1e293b, #334155)",
                                    color: "white", p: 3, borderRadius: 3,
                                    position: "relative", minHeight: 130
                                }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        {c.cardType.toUpperCase()}
                                    </Typography>
                                    <Typography variant="h6" letterSpacing={3} mt={1}>
                                        •••• •••• •••• {c.lastFourDigits}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Card Holder</Typography>
                                            <Typography variant="body2">{c.cardHolderName}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Expires</Typography>
                                            <Typography variant="body2">{c.expiryMonth}/{c.expiryYear}</Typography>
                                        </Box>
                                    </Box>
                                    <Button size="small" color="error" variant="text"
                                        onClick={() => handleDeleteCard(c._id)}
                                        sx={{ position: "absolute", top: 8, right: 8, color: "#f87171", minWidth: "auto" }}>
                                        ✕
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
}
