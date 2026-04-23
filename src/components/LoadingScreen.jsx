import { Box, Typography, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            current += Math.random() * 30 + 10;
            if (current > 100) current = 100;
            setProgress(current);
            if (current >= 100) clearInterval(interval);
        }, 350);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{
            position: "fixed", inset: 0, zIndex: 9999,
            bgcolor: "#1B2B4B",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 3
        }}>
            <Box sx={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,107,107,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

            <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <Typography variant="h3" fontWeight={800} color="white" mb={0.5}>
                    Shop<Box component="span" sx={{ color: "#FF6B6B" }}>Zone</Box>
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 5 }}>Premium eCommerce</Typography>

                <Box sx={{ width: 240, mx: "auto" }}>
                    <LinearProgress variant="determinate" value={progress}
                        sx={{ height: 3, borderRadius: 10, bgcolor: "rgba(255,255,255,0.08)", "& .MuiLinearProgress-bar": { bgcolor: "#FF6B6B", borderRadius: 10 } }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748b", mt: 1.5, display: "block" }}>
                        {Math.round(progress)}%
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
