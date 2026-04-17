import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Typography, Grid, TextField, Button,
    Box, Paper, Divider, Alert, Stepper, Step, StepLabel,
    Radio, RadioGroup, FormControlLabel, Chip
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { placeOrder } from "../services/orderService";
import { getMyCards } from "../services/cardService";
import { useCart } from "../context/CartContext";

const steps = ["Shipping", "Payment", "Confirm"];

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState({ street: "", city: "", country: "" });
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMyCards().then((d) => setCards(d.cards || [])).catch(() => {});
    }, []);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!address.street || !address.city || !address.country)
                return setError("Please fill all address fields");
        }
        setError("");
        setActiveStep((s) => s + 1);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const items = cart.map((i) => ({
                product: i._id,
                name: i.name,
                price: i.discountPrice || i.price,
                quantity: i.quantity,
            }));
            await placeOrder({ items, shippingAddress: address });
            clearCart();
            navigate("/orders");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        navigate("/cart");
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {/* Step 1: Shipping */}
                        {activeStep === 0 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={3}>
                                    <LocalShippingIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">Shipping Address</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField label="Street Address" value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        required fullWidth />
                                    <TextField label="City" value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        required fullWidth />
                                    <TextField label="Country" value={address.country}
                                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                        required fullWidth />
                                </Box>
                                <Button variant="contained" size="large" onClick={handleNext}
                                    sx={{ mt: 3, background: "linear-gradient(90deg,#38bdf8,#6366f1)", textTransform: "none" }}>
                                    Continue to Payment
                                </Button>
                            </Box>
                        )}

                        {/* Step 2: Payment */}
                        {activeStep === 1 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={3}>
                                    <CreditCardIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">Payment Method</Typography>
                                </Box>
                                {cards.length > 0 ? (
                                    <RadioGroup value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                                        {cards.map((c) => (
                                            <Paper key={c._id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2,
                                                borderColor: selectedCard === c._id ? "#6366f1" : "divider" }}>
                                                <FormControlLabel value={c._id} control={<Radio />}
                                                    label={
                                                        <Box>
                                                            <Typography fontWeight="bold">
                                                                {c.cardType.toUpperCase()} •••• {c.lastFourDigits}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {c.cardHolderName} | Exp: {c.expiryMonth}/{c.expiryYear}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Paper>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        No saved cards. Go to Profile to add a card, or continue with Cash on Delivery.
                                    </Alert>
                                )}
                                <Box display="flex" gap={2} mt={2}>
                                    <Button variant="outlined" onClick={() => setActiveStep(0)} sx={{ textTransform: "none" }}>
                                        Back
                                    </Button>
                                    <Button variant="contained" onClick={handleNext}
                                        sx={{ background: "linear-gradient(90deg,#38bdf8,#6366f1)", textTransform: "none" }}>
                                        Review Order
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Step 3: Confirm */}
                        {activeStep === 2 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={3}>
                                    <CheckCircleIcon color="success" />
                                    <Typography variant="h6" fontWeight="bold">Order Review</Typography>
                                </Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Shipping To:</Typography>
                                <Typography mb={2}>{address.street}, {address.city}, {address.country}</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Payment:</Typography>
                                <Typography mb={2}>
                                    {selectedCard
                                        ? `Card ending in ${cards.find(c => c._id === selectedCard)?.lastFourDigits}`
                                        : "Cash on Delivery"}
                                </Typography>
                                <Box display="flex" gap={2} mt={3}>
                                    <Button variant="outlined" onClick={() => setActiveStep(1)} sx={{ textTransform: "none" }}>
                                        Back
                                    </Button>
                                    <Button variant="contained" size="large" disabled={loading}
                                        onClick={handlePlaceOrder}
                                        sx={{ background: "linear-gradient(90deg,#38bdf8,#6366f1)", textTransform: "none", px: 4 }}>
                                        {loading ? "Placing Order..." : "Place Order"}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 80 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {cart.map((item) => (
                            <Box key={item._id} display="flex" justifyContent="space-between" mb={1.5} alignItems="center">
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box component="img"
                                        src={item.image || `https://placehold.co/50x50?text=${encodeURIComponent(item.name)}`}
                                        sx={{ width: 45, height: 45, borderRadius: 1, objectFit: "cover" }}
                                    />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: 150 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">× {item.quantity}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" fontWeight="bold">
                                    ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6" fontWeight="bold">Total</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">${total.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
