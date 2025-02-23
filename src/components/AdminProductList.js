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
     

     
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductList; 