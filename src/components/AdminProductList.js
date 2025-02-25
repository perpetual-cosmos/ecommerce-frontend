import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid, Chip
} from '@mui/material';
import { Add, Image as ImageIcon, Delete, Edit } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const categories = ['ebook', 'software', 'template', 'course', 'other'];

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_id: '',
    name: '',
    description: '',
    price: '',
    offer_price: '',
    category: '',
    file: null,
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/product/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Open dialog and generate product_id
  const handleOpen = () => {
    setForm({
      product_id: uuidv4(),
      name: '',
      description: '',
      price: '',
      offer_price: '',
      category: '',
      file: null,
      images: []
    });
    setImageFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleImageFilesChange = e => {
    setImageFiles(Array.from(e.target.files));
  };

  // Submit new product
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Upload product (file as base64)
      const fileBase64 = await toBase64(form.file);
      const productRes = await axios.post('/api/product', {
        ...form,
        file: fileBase64
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const product_id = productRes.data.product.product_id;

      // 2. Upload images
      for (const img of imageFiles) {
        const imgBase64 = await toBase64(img);
        await axios.post('/api/image', {
          product_id,
          imageFile: imgBase64,
          imageType: 'gallery',
          altText: img.name
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setLoading(false);
      setOpen(false);
      fetchProducts();
    } catch (err) {
      setLoading(false);
      alert('Error creating product');
      console.error(err);
    }
  };

  // Helper: file to base64
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Product Listing</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ mb: 2 }}>Add Product</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product._id}>
                <TableCell><Chip label={product.product_id} size="small" /></TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.offer_price ? `$${product.offer_price}` : '-'}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton color="primary"><Edit /></IconButton>
                  <IconButton color="error"><Delete /></IconButton>
                  {/* TODO: Add image view/edit */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Creation Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Product ID" name="product_id" value={form.product_id} fullWidth disabled margin="dense" />
                <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth required margin="dense" />
                <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} fullWidth required margin="dense" multiline rows={3} />
                <TextField label="Price" name="price" value={form.price} onChange={handleFormChange} type="number" fullWidth required margin="dense" />
                <TextField label="Offer Price" name="offer_price" value={form.offer_price} onChange={handleFormChange} type="number" fullWidth margin="dense" />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={form.category} onChange={handleFormChange} required>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  Upload Product File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {form.file && <Typography variant="body2" sx={{ mt: 1 }}>{form.file.name}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>Product Images</Typography>
                <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                  Upload Images
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageFilesChange} />
                </Button>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {imageFiles.map((img, idx) => (
                    <Chip key={idx} label={img.name} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductList; 