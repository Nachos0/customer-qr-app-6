import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomer, updateCustomer } from '../firebase';

const DisplayData = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState(''); // State for the selected new status
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const customerData = await getCustomer(id);
        if (customerData) {
          setData(customerData);
          setNewStatus(customerData.status); // Initialize newStatus with current status
        } else {
          setError('No data found for this code.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred.');
      }
    };

    fetchData();
  }, [id]);

    const handleStatusUpdate = async () => {
        setUpdateMessage('');
        if (!newStatus) {
            setUpdateMessage('Please select a new status.');
            return;
        }

        try {
            const updatedCustomer = await updateCustomer(id, { ...data, status: newStatus });
            if (updatedCustomer) {
                setData(updatedCustomer);
                setUpdateMessage('Status updated successfully!');
            } else {
                setUpdateMessage('Failed to update status.');
            }
        } catch (error) {
            setUpdateMessage('An error occurred while updating status.');
        }
    };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="display-data">
      <h2>Customer Information</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Date:</strong> {data.date}</p>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Description:</strong> {data.description}</p>

      <div>
        <label>Change Status:</label>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done/Completed">Done/Completed</option>
        </select>
        <button onClick={handleStatusUpdate}>Update Status</button>
        {updateMessage && <p>{updateMessage}</p>}
      </div>
    </div>
  );
};

export default DisplayData;
