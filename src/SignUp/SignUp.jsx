import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField, Button, Box, Typography, Container, Alert, Paper
} from "@mui/material";
import { styled } from "@mui/system";
import { signup } from "../services/authService";

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
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)", animation: "fadeIn 1s ease",
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

export default function SignupForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!formData.name) e.name = "Name is required";
        if (!formData.email) e.email = "Email is required";
        if (!formData.password || formData.password.length < 6) e.password = "Min 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        try {
            await signup(formData);
            navigate("/login");
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
                            Create Account
                        </Typography>
                        {apiError && <Alert severity="error">{apiError}</Alert>}
                        <TextField label="Full Name" name="name" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name} helperText={errors.name} fullWidth sx={inputSx} />
                        <TextField label="Email" name="email" type="email" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={!!errors.email} helperText={errors.email} fullWidth sx={inputSx} />
                        <TextField label="Password" name="password" type="password" value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={!!errors.password} helperText={errors.password} fullWidth sx={inputSx} />
                        <Button type="submit" variant="contained" size="large" disabled={loading}
                            sx={{ mt: 1, background: "linear-gradient(90deg,#38bdf8,#6366f1)", fontWeight: "bold" }}>
                            {loading ? "Creating..." : "Create Account"}
                        </Button>
                        <Typography textAlign="center" sx={{ color: "#94a3b8" }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: "#38bdf8" }}>Login</Link>
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </Background>
    );
}
