import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, Select, MenuItem, IconButton, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, updateUserRole, deleteUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
    const { user: me } = useAuth();

    const fetch = () => {
        setLoading(true);
        getAllUsers().then((d) => setUsers(d.users || [])).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, []);

    const handleRole = async (id, role) => {
        await updateUserRole(id, role);
        fetch();
    };

    const handleDelete = async () => {
        await deleteUser(deleteDialog.id);
        setDeleteDialog({ open: false, id: null });
        fetch();
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Users</Typography>
            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#111827" }}>
                        <TableRow>
                            {["Name", "Email", "Role", "Actions"].map((h) => (
                                <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id} hover>
                                <TableCell fontWeight="bold">{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Select value={u.role} size="small"
                                        disabled={u._id === me?._id}
                                        onChange={(e) => handleRole(u._id, e.target.value)}
                                        renderValue={(v) => <Chip label={v} color={v === "admin" ? "warning" : "default"} size="small" />}>
                                        <MenuItem value="user">user</MenuItem>
                                        <MenuItem value="admin">admin</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" disabled={u._id === me?._id}
                                        onClick={() => setDeleteDialog({ open: true, id: u._id })}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Delete User?</DialogTitle>
                <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
