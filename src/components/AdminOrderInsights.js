import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, Chip, Pagination, Grid, Card, CardContent
} from '@mui/material';
import axios from 'axios';

const statusOptions = ['all', 'pending', 'completed', 'failed', 'refunded'];

const AdminOrderInsights = () => {


  

 
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Order Insights</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="subtitle2">Total Sales</Typography><Typography variant="h6">${metrics.totalSales}</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="subtitle2">Total Orders</Typography><Typography variant="h6">{metrics.totalOrders}</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="subtitle2">Completed</Typography><Typography variant="h6">{metrics.completed}</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="subtitle2">Refunded</Typography><Typography variant="h6">{metrics.refunded}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={pagination.total} page={pagination.current} onChange={(_, val) => setPage(val)} color="primary" />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Product-wise Sales</Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 500, mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Sales Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(metrics.productSales).map(([prod, count]) => (
                <TableRow key={prod}>
                  <TableCell>{prod}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AdminOrderInsights; 