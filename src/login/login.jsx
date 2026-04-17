import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField, Button, Box, Typography, Container, Alert,
    Paper, IconButton, InputAdornment, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Background = styled(Box)({
    minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    backgroundSize: "400% 400%", animation: "gradientMove 10s ease infinite",
    "@keyframes gradientMove": {
        "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" }
    }
});

const Card = styled(Paper)({
    padding: "40px", width: "100%", maxWidth: "420px", borderRadius: "20px",
    backdropFilter: "blur(15px)", background: "rgba(255,255,255,0.05)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)", animation: "fadeIn 0.8s ease",
    "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(30px)" }, to: { opacity: 1, transform: "translateY(0)" } }
});

const inputSx = {
    input: { color: "white" }, label: { color: "#94a3b8" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#334155" },
        "&:hover fieldset": { borderColor: "#38bdf8" },
        "&.Mui-focused fieldset": { borderColor: "#38bdf8" }
    }
};

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
        <Background>
            <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Card elevation={10}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Typography variant="h4" textAlign="center" sx={{ fontWeight: "bold", color: "#38bdf8" }}>
                            Welcome Back
                        </Typography>
                        {apiError && <Alert severity="error">{apiError}</Alert>}
                        <TextField label="Email" name="email" type="email"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={!!errors.email} helperText={errors.email} fullWidth sx={inputSx} />
                        <TextField label="Password" name="password" type={showPass ? "text" : "password"}
                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={!!errors.password} helperText={errors.password} fullWidth sx={inputSx}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: "#94a3b8" }}>
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }} />
                        <Button type="submit" variant="contained" size="large" disabled={loading}
                            sx={{ mt: 1, background: "linear-gradient(90deg,#38bdf8,#6366f1)", fontWeight: "bold" }}>
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                        </Button>
                        <Typography textAlign="center" sx={{ color: "#94a3b8" }}>
                            Don't have an account?{" "}
                            <Link to="/signup" style={{ color: "#38bdf8" }}>Register</Link>
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </Background>
    );
}
