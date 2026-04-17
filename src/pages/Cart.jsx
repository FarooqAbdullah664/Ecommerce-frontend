import { Link, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Button, Divider,
    IconButton, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
    const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) return navigate("/login");
        navigate("/checkout");
    };

    if (cart.length === 0) return (
        <Container sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
            <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
                Continue Shopping
            </Button>
        </Container>
    );

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Shopping Cart</Typography>
            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="center">Subtotal</TableCell>
                            <TableCell align="center">Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Box component="img"
                                            src={item.image || `https://placehold.co/60x60?text=${encodeURIComponent(item.name)}`}
                                            sx={{ width: 60, height: 60, borderRadius: 2, objectFit: "cover" }}
                                        />
                                        <Typography fontWeight="bold">{item.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">${item.discountPrice || item.price}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number" value={item.quantity} size="small"
                                        onChange={(e) => updateQty(item._id, Number(e.target.value))}
                                        inputProps={{ min: 1, style: { textAlign: "center", width: 50 } }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2} flexWrap="wrap">
                <Button variant="outlined" color="error" onClick={clearCart}>Clear Cart</Button>
                <Box sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 3, minWidth: 280 }}>
                    <Typography variant="h6" gutterBottom>Order Summary</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography>Total</Typography>
                        <Typography fontWeight="bold" variant="h6">${total.toFixed(2)}</Typography>
                    </Box>
                    <Button variant="contained" fullWidth size="large" onClick={handleCheckout}
                        sx={{ background: "linear-gradient(90deg,#38bdf8,#6366f1)" }}>
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
