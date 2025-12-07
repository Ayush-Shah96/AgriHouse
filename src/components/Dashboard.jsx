import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // In real app: fetch('http://localhost:8000/dashboard-stats')
    // Simulating API response for display purposes
    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:8000/dashboard-stats');
            const json = await res.json();
            setData(json);
        } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading AI Analytics...</div>;

  const cardStyle = { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '30%', marginBottom: '20px', borderTop: '4px solid #0ea5e9' };
  const alertCardStyle = { ...cardStyle, borderTop: '4px solid #ef4444' }; // Red for expiry
  const headerStyle = { color: '#22c55e', marginBottom: '10px' };

  return (
    <div>
      <h2 style={{ color: '#0ea5e9' }}>Warehouse Intelligence Dashboard</h2>
      

[Image of warehouse inventory dashboard]

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
        
        <div style={cardStyle}>
          <h3 style={headerStyle}>Total Inventory</h3>
          <h1>{data.total_stock} Units</h1>
          <p>Current Warehouse Load</p>
        </div>

        <div style={alertCardStyle}>
          <h3 style={{color: '#ef4444'}}>Expiring Soon</h3>
          <h1>{data.expiring_soon} Products</h1>
          <p>Action needed immediately</p>
        </div>

        <div style={cardStyle}>
          <h3 style={headerStyle}>Storage Capacity</h3>
          <h1>{data.warehouse_capacity}</h1>
          <p>Available Slots: {data.empty_slots}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={headerStyle}>Staff On-Site</h3>
          <h1>{data.staff_active} Members</h1>
        </div>

        <div style={cardStyle}>
          <h3 style={headerStyle}>Today's Financials</h3>
          <p>Stock In Cost: <strong>${data.financials.out}</strong></p>
          <p>Sales (Out): <strong>${data.financials.in}</strong></p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;