import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert, IconButton, InputAdornment, CircularProgress, Divider } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        const e = {};
        if (!formData.email) e.email = "Email is required";
        if (!formData.password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await login(formData);
            setUser(data.user);
            navigate(data.user.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Left - Branding */}
            <Box sx={{ width: "50%", display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "center", p: 8, bgcolor: "#1B2B4B", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,107,107,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h5" fontWeight={800} mb={6} color="white">
                        Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                    </Typography>
                    <Typography variant="h2" fontWeight={800} color="white" mb={2} sx={{ letterSpacing: "-1px", lineHeight: 1.1 }}>
                        Welcome<br />Back
                    </Typography>
                    <Typography sx={{ color: "#94a3b8", mb: 6, fontSize: "1.05rem", lineHeight: 1.8 }}>
                        Sign in to access your account and continue your shopping journey.
                    </Typography>
                    {["Access your order history", "Save cards for faster checkout", "Get exclusive member deals", "Track deliveries in real-time"].map((f) => (
                        <Box key={f} display="flex" alignItems="center" gap={1.5} mb={2}>
                            <CheckCircleIcon sx={{ color: "#FF6B6B", fontSize: 18, flexShrink: 0 }} />
                            <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>{f}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Right - Form */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 6 }, bgcolor: "white" }}>
                <Box sx={{ width: "100%", maxWidth: 400 }}>
                    <Typography variant="h4" fontWeight={800} color="#1B2B4B" gutterBottom>Sign in</Typography>
                    <Typography color="text.secondary" mb={4}>Enter your credentials to continue</Typography>

                    {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
                        <TextField label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} helperText={errors.email} fullWidth />
                        <TextField label="Password" type={showPass ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={!!errors.password} helperText={errors.password} fullWidth
                            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} edge="end">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                        <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ py: 1.5, mt: 1, bgcolor: "#1B2B4B", "&:hover": { bgcolor: "#0f1c33" } }}>
                            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Sign In"}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    <Typography textAlign="center" color="text.secondary" variant="body2">
                        Don't have an account?{" "}
                        <Link to="/signup" style={{ color: "#FF6B6B", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
