import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NewCustomerForm from './components/NewCustomerForm';
import ScanQRCode from './components/ScanQRCode';
import DisplayData from './components/DisplayData';
import CustomerList from './components/CustomerList';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="container">
      <h1>small QRcode app</h1>
      <div className="page-content">
         <Routes>
            <Route path="/" element={<Home navigate={navigate} />} />
            <Route path="/new-customer" element={<NewCustomerForm />} />
            <Route path="/scan" element={<ScanQRCode />} />
            <Route path="/display/:id" element={<DisplayData />} />
            <Route path="/customers" element={<CustomerList />} />
          </Routes>
      </div>
      {location.pathname !== '/' && (
        <div className="back-button-container">
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  );
}

function Home({ navigate }) {
    return (
        <div className="home-buttons-container">
            <button onClick={() => navigate('/new-customer')}>New Customer</button>
            <button onClick={() => navigate('/scan')}>Scan QR</button>
            <button onClick={() => navigate('/customers')}>View Customers</button>
        </div>
    )
}

export default App;
