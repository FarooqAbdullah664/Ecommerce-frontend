import { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow,
    Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Alert, Chip, CircularProgress, Switch, FormControlLabel,
    InputAdornment, Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";

const empty = {
    name: "", description: "", price: "", discountPrice: "",
    category: "", brand: "", sku: "", stock: "", image: "", isActive: true
};

const categories = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, mode: "add", data: empty });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
    const [error, setError] = useState("");
    const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

    const fetchAll = () => {
        setLoading(true);
        getProducts({ limit: 200 })
            .then((d) => { setProducts(d.products || []); setFiltered(d.products || []); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []);

    useEffect(() => {
        if (!search) return setFiltered(products);
        setFiltered(products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, products]);

    const openAdd = () => setDialog({ open: true, mode: "add", data: empty });
    const openEdit = (p) => setDialog({
        open: true, mode: "edit",
        data: { ...p, discountPrice: p.discountPrice || "" }
    });

    const handleSave = async () => {
        setError("");
        try {
            const payload = {
                ...dialog.data,
                price: Number(dialog.data.price),
                stock: Number(dialog.data.stock),
                discountPrice: dialog.data.discountPrice ? Number(dialog.data.discountPrice) : undefined
            };
            if (dialog.mode === "add") await addProduct(payload);
            else await updateProduct(dialog.data._id, payload);
            setDialog({ ...dialog, open: false });
            setSnack({ open: true, msg: `Product ${dialog.mode === "add" ? "added" : "updated"} successfully!`, type: "success" });
            fetchAll();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProduct(deleteDialog.id);
            setDeleteDialog({ open: false, id: null });
            setSnack({ open: true, msg: "Product deleted!", type: "success" });
            fetchAll();
        } catch (err) {
            setSnack({ open: true, msg: err.message, type: "error" });
        }
    };

    const set = (field, val) => setDialog((d) => ({ ...d, data: { ...d.data, [field]: val } }));

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="h4" fontWeight="bold">Products</Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField placeholder="Search products..." size="small" value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                        sx={{ minWidth: 220 }}
                    />
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
                        sx={{ textTransform: "none", background: "linear-gradient(90deg,#38bdf8,#6366f1)" }}>
                        Add Product
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "#0f172a" }}>
                            <TableRow>
                                {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                                    <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((p) => (
                                <TableRow key={p._id} hover>
                                    <TableCell>
                                        <Box component="img"
                                            src={p.image || `https://placehold.co/50x50?text=${encodeURIComponent(p.name)}`}
                                            sx={{ width: 50, height: 50, borderRadius: 2, objectFit: "cover" }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold" variant="body2">{p.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{p.brand}</Typography>
                                    </TableCell>
                                    <TableCell><Chip label={p.category} size="small" sx={{ bgcolor: "#e0f2fe", color: "#0369a1" }} /></TableCell>
                                    <TableCell>
                                        {p.discountPrice ? (
                                            <Box>
                                                <Typography fontWeight="bold" color="error.main">${p.discountPrice}</Typography>
                                                <Typography variant="caption" sx={{ textDecoration: "line-through", color: "gray" }}>${p.price}</Typography>
                                            </Box>
                                        ) : (
                                            <Typography fontWeight="bold">${p.price}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={p.stock} size="small"
                                            color={p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "error"} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={p.isActive ? "Active" : "Inactive"}
                                            color={p.isActive ? "success" : "default"} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" size="small" onClick={() => openEdit(p)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small"
                                            onClick={() => setDeleteDialog({ open: true, id: p._id })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No products found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {dialog.mode === "add" ? "➕ Add New Product" : "✏️ Edit Product"}
                </DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Product Name *" value={dialog.data.name}
                                onChange={(e) => set("name", e.target.value)} fullWidth size="small" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Category *" value={dialog.data.category}
                                onChange={(e) => set("category", e.target.value)}
                                fullWidth size="small" select SelectProps={{ native: true }}>
                                <option value="">Select Category</option>
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Brand" value={dialog.data.brand}
                                onChange={(e) => set("brand", e.target.value)} fullWidth size="small" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="SKU *" value={dialog.data.sku}
                                onChange={(e) => set("sku", e.target.value)} fullWidth size="small" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Price *" type="number" value={dialog.data.price}
                                onChange={(e) => set("price", e.target.value)} fullWidth size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Discount Price" type="number" value={dialog.data.discountPrice}
                                onChange={(e) => set("discountPrice", e.target.value)} fullWidth size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Stock *" type="number" value={dialog.data.stock}
                                onChange={(e) => set("stock", e.target.value)} fullWidth size="small" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Image URL" value={dialog.data.image}
                                onChange={(e) => set("image", e.target.value)} fullWidth size="small"
                                placeholder="https://example.com/image.jpg" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Description *" value={dialog.data.description}
                                onChange={(e) => set("description", e.target.value)}
                                fullWidth multiline rows={3} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={dialog.data.isActive}
                                    onChange={(e) => set("isActive", e.target.checked)} color="success" />}
                                label="Product Active (visible to buyers)"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setDialog({ ...dialog, open: false })} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}
                        sx={{ textTransform: "none", background: "linear-gradient(90deg,#38bdf8,#6366f1)" }}>
                        {dialog.mode === "add" ? "Add Product" : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Delete Product?</DialogTitle>
                <DialogContent>
                    <Typography>This action cannot be undone. Product will be permanently deleted.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained" onClick={handleDelete} sx={{ textTransform: "none" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity={snack.type} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
