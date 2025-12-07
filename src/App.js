import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import InvoiceGen from './components/InvoiceGen';
import ScannerParams from './components/ScannerParams';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Styles
  const navStyle = { backgroundColor: '#ffffff', borderBottom: '3px solid #0ea5e9', padding: '1rem', display: 'flex', justifyContent: 'space-between' };
  const linkStyle = { color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none', margin: '0 15px', fontSize: '18px' };
  const btnStyle = { backgroundColor: '#22c55e', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f9ff', minHeight: '100vh' }}>
        {isAuthenticated && (
          <nav style={navStyle}>
            <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>AgriStore AI</div>
            <div>
              <Link to="/" style={linkStyle}>Dashboard</Link>
              <Link to="/invoice" style={linkStyle}>Add Stock (QR)</Link>
              <Link to="/scan" style={linkStyle}>Withdraw/Scan</Link>
              <button onClick={() => setIsAuthenticated(false)} style={btnStyle}>Logout</button>
            </div>
          </nav>
        )}

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/invoice" element={isAuthenticated ? <InvoiceGen /> : <Navigate to="/login" />} />
            <Route path="/scan" element={isAuthenticated ? <ScannerParams /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;