import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../firebase';

const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setError('');
      try {
        const fetchedCustomers = await getCustomers();
        if (fetchedCustomers) {
          fetchedCustomers.sort((a, b) => new Date(b.date) - new Date(a.date));
          setCustomers(fetchedCustomers);
        } else {
          setError('Failed to fetch customers.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred.');
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="customer-list-heading">Customers List</h2>
       {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="customer-list">
        {filteredCustomers.length === 0 ? (
          <p>No customers to display.</p>
        ) : (
          filteredCustomers.map((customer) => (
            <Link to={`/display/${customer.id}`} key={customer.id} className="customer-card">
              <div>
                <strong>Name:</strong> {customer.name}
              </div>
              <div>
                <strong>Status:</strong> {customer.status}
              </div>
              <div>
                <strong>Date:</strong> {customer.date}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerList;
