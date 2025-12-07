import React, { useState } from 'react';

const ScannerParams = () => {
  const [scanData, setScanData] = useState('');
  const [status, setStatus] = useState('');

  // Note: For a real project, use 'react-qr-reader' to access the webcam.
  // For this prototype, we simulate scanning by pasting the QR string.
  
  const handleScanSimulation = async () => {
    try {
        const res = await fetch('http://localhost:8000/scan-action', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ qr_data: scanData })
        });
        const json = await res.json();
        setStatus(json.message || json.detail);
    } catch(err) { setStatus("Error processing scan"); }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ color: '#0ea5e9' }}>Stock Withdrawal / Scan</h2>
      <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '40px', borderRadius: '10px' }}>
        <p>Scan Product QR Code (or paste ID below)</p>
        <input 
            type="text" 
            value={scanData} 
            onChange={(e) => setScanData(e.target.value)} 
            placeholder="Scan/Paste QR Data..." 
            style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleScanSimulation} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px' }}>
            Process Transaction
        </button>
        
        {status && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f2fe', color: '#0ea5e9', borderRadius: '5px' }}>
                <strong>Status:</strong> {status}
            </div>
        )}
      </div>
    </div>
  );
};

export default ScannerParams;