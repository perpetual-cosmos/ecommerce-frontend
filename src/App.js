import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <CartProvider>
      <Router>
        
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
     
      </Router>
    </CartProvider>
  );
}
export default App;