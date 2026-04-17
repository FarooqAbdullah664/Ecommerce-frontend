import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllCards, adminDeleteCard } from "../services/cardService";

export default function AdminCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    const fetch = () => {
        setLoading(true);
        getAllCards().then((d) => setCards(d.cards || [])).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, []);

    const handleDelete = async () => {
        await adminDeleteCard(deleteDialog.id);
        setDeleteDialog({ open: false, id: null });
        fetch();
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Saved Cards</Typography>
            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#111827" }}>
                        <TableRow>
                            {["Card Holder", "User", "Card", "Expiry", "Type", "Actions"].map((h) => (
                                <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.map((c) => (
                            <TableRow key={c._id} hover>
                                <TableCell>{c.cardHolderName}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">{c.user?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{c.user?.email}</Typography>
                                </TableCell>
                                <TableCell>•••• •••• •••• {c.lastFourDigits}</TableCell>
                                <TableCell>{c.expiryMonth}/{c.expiryYear}</TableCell>
                                <TableCell><Chip label={c.cardType} size="small" /></TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => setDeleteDialog({ open: true, id: c._id })}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Delete Card?</DialogTitle>
                <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
