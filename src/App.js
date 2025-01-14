import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: 60}}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}
export default App;