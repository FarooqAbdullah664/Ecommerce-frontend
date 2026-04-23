import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Container, Typography, Grid, TextField, Button,
    Box, Paper, Divider, Alert, Stepper, Step, StepLabel,
    Radio, RadioGroup, FormControlLabel, Chip, CircularProgress
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or card id
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [ordered, setOrdered] = useState(false);

    useEffect(() => {
        getMyCards().then((d) => setCards(d.cards || [])).catch(() => {});
    }, []);

    if (cart.length === 0 && !ordered) {
        navigate("/cart");
        return null;
    }

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
            setOrdered(true);
            setActiveStep(3); // success step
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const shipping = total >= 50 ? 0 : 9.99;
    const grandTotal = total + shipping;

    // Success Screen
    if (activeStep === 3) return (
        <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
            <Box sx={{ fontSize: 100, mb: 3 }}>🎉</Box>
            <Typography variant="h4" fontWeight={800} gutterBottom color="success.main">
                Order Placed!
            </Typography>
            <Typography color="text.secondary" mb={4}>
                Thank you for your order. We'll send you a confirmation soon.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
                <Button component={Link} to="/orders" variant="contained"
                    sx={{ background: "#1B2B4B", borderRadius: 3, px: 4 }}>
                    View My Orders
                </Button>
                <Button component={Link} to="/products" variant="outlined"
                    sx={{ borderRadius: 3, px: 4 }}>
                    Continue Shopping
                </Button>
            </Box>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={800} mb={1} sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>Checkout</Typography>
            <Typography color="text.secondary" mb={{ xs: 3, md: 4 }}>Complete your purchase</Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: { xs: 3, md: 5 } }}>
                {steps.map((label, i) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconProps={{
                                sx: {
                                    "&.Mui-active": { color: "#1B2B4B" },
                                    "&.Mui-completed": { color: "#10b981" }
                                }
                            }}>
                            <Typography fontWeight={activeStep === i ? 700 : 400} sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{label}</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={{ xs: 2, md: 4 }}>
                {/* Left - Steps */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ borderRadius: 4, p: { xs: 2.5, md: 4 }, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        {/* ===== STEP 1: SHIPPING ===== */}
                        {activeStep === 0 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#EEF2FF", color: "#1B2B4B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <LocalShippingIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Shipping Address</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" gap={2.5}>
                                    <TextField label="Street Address" value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        required fullWidth placeholder="123 Main Street"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField label="City" value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                required fullWidth placeholder="New York"
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField label="Country" value={address.country}
                                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                                required fullWidth placeholder="USA"
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Button variant="contained" size="large" onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        mt: 4, py: 1.5, px: 4, borderRadius: 3, fontWeight: 700,
                                        background: "#1B2B4B",
                                        "&:hover": { background: "#0f1c33" }
                                    }}>
                                    Continue to Payment
                                </Button>
                            </Box>
                        )}

                        {/* ===== STEP 2: PAYMENT ===== */}
                        {activeStep === 1 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#EEF2FF", color: "#1B2B4B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <CreditCardIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Payment Method</Typography>
                                </Box>

                                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    {/* Cash on Delivery */}
                                    <Paper variant="outlined" onClick={() => setPaymentMethod("cod")}
                                        sx={{
                                            p: 2.5, mb: 2, borderRadius: 3, cursor: "pointer",
                                            borderColor: paymentMethod === "cod" ? "#1B2B4B" : "#E5E7EB",
                                            borderWidth: paymentMethod === "cod" ? 2 : 1,
                                            bgcolor: paymentMethod === "cod" ? "#F8F9FA" : "white",
                                            transition: "all 0.2s"
                                        }}>
                                        <FormControlLabel value="cod" control={<Radio sx={{ color: "#1B2B4B", "&.Mui-checked": { color: "#1B2B4B" } }} />}
                                            label={
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <LocalAtmIcon sx={{ color: "#f59e0b" }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography fontWeight={700}>Cash on Delivery</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Pay when your order arrives
                                                        </Typography>
                                                    </Box>
                                                    <Chip label="Popular" size="small" color="warning"
                                                        sx={{ ml: "auto", fontWeight: 700 }} />
                                                </Box>
                                            }
                                            sx={{ m: 0, width: "100%" }}
                                        />
                                    </Paper>

                                    {/* Saved Cards */}
                                    {cards.length > 0 && (
                                        <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1.5}>
                                            — Or pay with saved card —
                                        </Typography>
                                    )}

                                    {cards.map((c) => (
                                        <Paper key={c._id} variant="outlined"
                                            onClick={() => setPaymentMethod(c._id)}
                                            sx={{
                                                p: 2.5, mb: 2, borderRadius: 3, cursor: "pointer",
                                                borderColor: paymentMethod === c._id ? "#1B2B4B" : "#E5E7EB",
                                                borderWidth: paymentMethod === c._id ? 2 : 1,
                                                bgcolor: paymentMethod === c._id ? "#F8F9FA" : "white",
                                                transition: "all 0.2s"
                                            }}>
                                            <FormControlLabel value={c._id}
                                                control={<Radio sx={{ color: "#1B2B4B", "&.Mui-checked": { color: "#1B2B4B" } }} />}
                                                label={
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Box sx={{
                                                            width: 44, height: 44, borderRadius: 2,
                                                            background: "linear-gradient(135deg,#1e293b,#334155)",
                                                            display: "flex", alignItems: "center", justifyContent: "center"
                                                        }}>
                                                            <CreditCardIcon sx={{ color: "white", fontSize: 20 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography fontWeight={700}>
                                                                {c.cardType.toUpperCase()} •••• {c.lastFourDigits}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {c.cardHolderName} | Exp: {c.expiryMonth}/{c.expiryYear}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                                sx={{ m: 0, width: "100%" }}
                                            />
                                        </Paper>
                                    ))}

                                    {cards.length === 0 && (
                                        <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3, textAlign: "center" }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No saved cards.{" "}
                                                <Link to="/profile" style={{ color: "#FF6B6B", fontWeight: 700 }}>
                                                    Add a card
                                                </Link>{" "}
                                                in your profile.
                                            </Typography>
                                        </Box>
                                    )}
                                </RadioGroup>

                                <Box display="flex" gap={2} mt={3}>
                                    <Button variant="outlined" onClick={() => setActiveStep(0)}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ borderRadius: 3, px: 3 }}>
                                        Back
                                    </Button>
                                    <Button variant="contained" onClick={handleNext}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            borderRadius: 3, px: 4, fontWeight: 700,
                                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                        }}>
                                        Review Order
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* ===== STEP 3: CONFIRM ===== */}
                        {activeStep === 2 && (
                            <Box>
                                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#d1fae5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <CheckCircleIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Review & Confirm</Typography>
                                </Box>

                                {/* Shipping Summary */}
                                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 3, mb: 2 }}>
                                    <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1}>
                                        📍 SHIPPING TO
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {address.street}, {address.city}, {address.country}
                                    </Typography>
                                </Box>

                                {/* Payment Summary */}
                                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 3, mb: 3 }}>
                                    <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1}>
                                        💳 PAYMENT METHOD
                                    </Typography>
                                    {paymentMethod === "cod" ? (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LocalAtmIcon sx={{ color: "#f59e0b" }} />
                                            <Typography fontWeight={600}>Cash on Delivery</Typography>
                                        </Box>
                                    ) : (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CreditCardIcon sx={{ color: "#1B2B4B" }} />
                                            <Typography fontWeight={600}>
                                                Card ending in {cards.find(c => c._id === paymentMethod)?.lastFourDigits}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box display="flex" gap={2}>
                                    <Button variant="outlined" onClick={() => setActiveStep(1)}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ borderRadius: 3, px: 3 }}>
                                        Back
                                    </Button>
                                    <Button variant="contained" size="large" disabled={loading}
                                        onClick={handlePlaceOrder}
                                        sx={{
                                            borderRadius: 3, px: 5, fontWeight: 700,
                                            bgcolor: "#1B2B4B",
                                            boxShadow: "0 4px 14px rgba(27,43,75,0.3)",
                                            "&:hover": { bgcolor: "#0f1c33", boxShadow: "0 8px 20px rgba(27,43,75,0.4)" }
                                        }}>
                                        {loading
                                            ? <CircularProgress size={22} sx={{ color: "white" }} />
                                            : "✓ Place Order"
                                        }
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Right - Order Summary */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ borderRadius: 4, p: { xs: 2.5, md: 3 }, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", position: { md: "sticky" }, top: { md: 80 } }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>Order Summary</Typography>

                        {cart.map((item) => (
                            <Box key={item._id} display="flex" gap={2} alignItems="center" mb={2}>
                                <Box component="img"
                                    src={item.image || `https://placehold.co/55x55/EEF2FF/1B2B4B?text=${encodeURIComponent(item.name)}`}
                                    sx={{ width: 55, height: 55, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
                                />
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={700} noWrap>{item.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={700} color="primary">
                                    ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography fontWeight={600}>${total.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography color="text.secondary">Shipping</Typography>
                            {shipping === 0
                                ? <Chip label="FREE" size="small" color="success" sx={{ fontWeight: 700 }} />
                                : <Typography fontWeight={600}>${shipping.toFixed(2)}</Typography>
                            }
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight={800} variant="h6">Total</Typography>
                            <Typography fontWeight={800} variant="h6" color="primary">
                                ${grandTotal.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #f1f5f9" }}>
                            {["🔒 SSL Secured", "↩️ 30-day returns", "📦 Tracked delivery"].map((t) => (
                                <Typography key={t} variant="caption" color="text.secondary"
                                    display="block" textAlign="center" mb={0.5}>
                                    {t}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
