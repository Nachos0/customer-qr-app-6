import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { addCustomer } from '../firebase';

const NewCustomerForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [description, setDescription] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const [customerQRValue, setCustomerQRValue] = useState('');
  const [ownerQRValue, setOwnerQRValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const customerData = { name, date, status, description };

    try {
      const newCustomer = await addCustomer(customerData);
      if (newCustomer) {
          const customerQRData = { id: newCustomer.id, type: 'customer', name, date, status, description };
          const ownerQRData = { id: newCustomer.id, type: 'owner', name, date, status, description };
          setCustomerQRValue(JSON.stringify(customerQRData));
          setOwnerQRValue(JSON.stringify(ownerQRData));
          setShowQR(true);
      } else {
          setError('Failed to add customer.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; }
            .qr-container { margin: 20px 0; text-align: center; width: 100%; }
            img { width: 200px; height: 200px; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Customer QR Code</h2>
            <img src="${document.querySelector('#customer-qr canvas').toDataURL()}" alt="Customer QR" />
            <p>${name}</p>
          </div>
          <div class="qr-container">
            <h2>Owner QR Code</h2>
            <img src="${document.querySelector('#owner-qr canvas').toDataURL()}" alt="Owner QR" />
            <p>${name}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleDone = () => {
    navigate('/');
  };

  if (showQR) {
    return (
      <div className="qr-container">
        <div>
          <h2>Customer QR Code</h2>
          <QRCodeCanvas id="customer-qr" value={customerQRValue} size={256} level="H" />
          <p>Give this code to the customer</p>
        </div>
        <div>
          <h2>Owner QR Code</h2>
          <QRCodeCanvas id="owner-qr" value={ownerQRValue} size={256} level="H" />
          <p>Keep this code for the owner</p>
        </div>
        <button className='print-button' onClick={handlePrint}>Print</button>
        <button onClick={handleDone}>Done</button>
      </div>
    );
  }

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done/Completed">Done/Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default NewCustomerForm;
