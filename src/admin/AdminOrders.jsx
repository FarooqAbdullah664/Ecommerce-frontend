import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, Select, MenuItem, IconButton, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/orderService";

const statusColor = { pending: "warning", shipped: "info", delivered: "success", cancelled: "error" };
const statuses = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    const fetch = () => {
        setLoading(true);
        getAllOrders().then((d) => setOrders(d.orders || [])).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, []);

    const handleStatus = async (id, status) => {
        await updateOrderStatus(id, status);
        fetch();
    };

    const handleDelete = async () => {
        await deleteOrder(deleteDialog.id);
        setDeleteDialog({ open: false, id: null });
        fetch();
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Orders</Typography>
            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#111827" }}>
                        <TableRow>
                            {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                                <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((o) => (
                            <TableRow key={o._id} hover>
                                <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{o._id.slice(-8)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{o.user?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{o.user?.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    {o.items.map((i) => (
                                        <Typography key={i._id} variant="caption" display="block">{i.name} ×{i.quantity}</Typography>
                                    ))}
                                </TableCell>
                                <TableCell><b>${o.totalAmount.toFixed(2)}</b></TableCell>
                                <TableCell>
                                    <Select value={o.status} size="small"
                                        onChange={(e) => handleStatus(o._id, e.target.value)}
                                        renderValue={(v) => <Chip label={v} color={statusColor[v]} size="small" />}>
                                        {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                    </Select>
                                </TableCell>
                                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => setDeleteDialog({ open: true, id: o._id })}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Delete Order?</DialogTitle>
                <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
