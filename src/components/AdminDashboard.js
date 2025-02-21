import React, { useState } from 'react';
import AdminProductList from './AdminProductList';
import AdminOrderInsights from './AdminOrderInsights';
import { Tabs, Tab, Box } from '@mui/material';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        
      </Tabs>
      {tab === 0 && <AdminProductList />}
      {tab === 1 && <AdminOrderInsights />}
    </Box>
  );
};

export default AdminDashboard;