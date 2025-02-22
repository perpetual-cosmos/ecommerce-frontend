import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, Chip, Pagination, Grid, Card, CardContent
} from '@mui/material';
import axios from 'axios';

const statusOptions = ['all', 'pending', 'completed', 'failed', 'refunded'];

const AdminOrderInsights = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [metrics, setMetrics] = useState({ totalSales: 0, totalOrders: 0, completed: 0, refunded: 0, productSales: {} });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/order/admin/all?status=${status}&page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
      calculateMetrics(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateMetrics = (orders) => {
    let totalSales = 0, totalOrders = 0, completed = 0, refunded = 0;
    const productSales = {};
    orders.forEach(order => {
      totalOrders++;
      if (order.status === 'completed') {
        totalSales += order.amount;
        completed++;
        const prod = order.product?.name || 'Unknown';
        productSales[prod] = (productSales[prod] || 0) + 1;
      }
      if (order.status === 'refunded') refunded++;
    });
    setMetrics({ totalSales, totalOrders, completed, refunded, productSales });
  };

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
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.name || 'N/A'}<br /><Typography variant="caption">{order.user?.email}</Typography></TableCell>
                <TableCell>{order.product?.name || 'N/A'}<br /><Typography variant="caption">{order.product?.category}</Typography></TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell><Chip label={order.status} color={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'refunded' ? 'info' : 'error'} /></TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
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