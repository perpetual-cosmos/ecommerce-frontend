import React, { useEffect, useState } from 'react';

import axios from 'axios';

const categories = ['ebook', 'software', 'template', 'course', 'other'];

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

     
  };


  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Product Listing</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ mb: 2 }}>Add Product</Button>
     

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