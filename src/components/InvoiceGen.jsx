import React, { useState } from 'react';

const InvoiceGen = () => {
  const [form, setForm] = useState({ name: '', type: '', expiry_date: '', shelf_code: '', price: 0 });
  const [qrImage, setQrImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8000/create-invoice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });
        if(response.ok) {
            const blob = await response.blob();
            setQrImage(URL.createObjectURL(blob));
        } else { alert("Error creating invoice"); }
    } catch(err) { console.error(err); }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' };
  const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#22c55e', textAlign: 'center' }}>New Stock Entry</h2>
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} placeholder="Product Name" onChange={e => setForm({...form, name: e.target.value})} />
          <input style={inputStyle} placeholder="Type (e.g. Dairy)" onChange={e => setForm({...form, type: e.target.value})} />
          <label>Expiry Date:</label>
          <input style={inputStyle} type="date" onChange={e => setForm({...form, expiry_date: e.target.value})} />
          <input style={inputStyle} placeholder="Shelf Code (e.g., A1)" onChange={e => setForm({...form, shelf_code: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} />
          <button type="submit" style={btnStyle}>Generate Invoice & QR</button>
        </form>

        {qrImage && (
          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '2px dashed #ccc', paddingTop: '10px' }}>
            <h3>Invoice Generated</h3>
            <img src={qrImage} alt="QR Code" style={{ width: '150px' }} />
            <p>Print this label for package</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceGen;