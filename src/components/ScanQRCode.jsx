import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { getCustomer } from '../firebase';

const ScanQRCode = () => {
  const scannerRef = useRef(null);
  const navigate = useNavigate();
    const [scannerActive, setScannerActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
      if (!scannerActive) {
          return;
      }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
       false);

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText, decodedResult) {
      setErrorMessage('');
      try {
          const parsedData = JSON.parse(decodedText);
          if (parsedData && parsedData.id) {
              const customer = await getCustomer(parsedData.id);
              if (customer) {
                  navigate(`/display/${parsedData.id}`);
              } else {
                  setErrorMessage('Customer data not found in Firebase.');
              }
          } else {
              setErrorMessage('Invalid QR Code data.');
          }
      } catch (error) {
          console.error("Failed to parse QR code data or fetch from Firebase:", error);
          setErrorMessage('Failed to process QR code data.');
      }

      html5QrcodeScanner.clear().then(() => {
          setScannerActive(false);
      }).catch((error) => {
          console.error("Failed to clear scanner:", error);
      });
    }

    function onScanError(error) {
      console.error("Scan error:", error);
    }

      return () => {
          if (scannerActive) {
              html5QrcodeScanner.clear().catch((error) => {
                  console.error("Failed to clear scanner:", error);
              });
          }
      };
  }, [navigate, scannerActive]);

  return (
      <>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div id="qr-reader" style={{ width: '100%' }}></div>
      </>
  );
};

export default ScanQRCode;
