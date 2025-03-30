import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [donations, setDonations] = useState([]);
  const [donor, setDonor] = useState('');
  const [donorId, setDonorId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [swipeCount, setSwipeCount] = useState(1);
  const [isPublic, setIsPublic] = useState(true);

  // Fetch donations from the backend
  useEffect(() => {
    fetch('http://localhost:5001/api/donations')
      .then((response) => response.json())
      .then((data) => setDonations(data));
  }, []);

  const handleDonate = () => {
    const donation = { donor, donorId, recipient, recipientId, swipeCount, public: isPublic };
    fetch('http://localhost:5001/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation),
    })
      .then((response) => response.json())
      .then((newDonation) => setDonations([...donations, newDonation]));
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date without time
  };

  return (
    <div className="App">
      <div className="header">
        <h1>MealSwipeShare</h1>
        <p className="tagline">Donate Meal Swipes, Share the Love!</p>
      </div>

      <div className="donation-form">
        <h2>Donate Meal Swipes</h2>

        <div className="input-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={donor}
            onChange={(e) => setDonor(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Donor ID</label>
          <input
            type="text"
            placeholder="Enter your donor ID"
            value={donorId}
            onChange={(e) => setDonorId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Recipient Name</label>
          <input
            type="text"
            placeholder="Recipient name or food bank"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Recipient ID</label>
          <input
            type="text"
            placeholder="Enter recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Swipe Count</label>
          <input
            type="number"
            min="1"
            placeholder="Swipe Count"
            value={swipeCount}
            onChange={(e) => setSwipeCount(Number(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <span>Public Donation</span>
          </label>
        </div>

        <div className="donate-button-container">
          <button className="donate-button" onClick={handleDonate}>Donate</button>
        </div>
      </div>

      <div className="donation-history">
        <h2>Donation History</h2>
        <ul>
          {/* Filter donations to show only public donations */}
          {donations
            .filter((donation) => donation.public)
            .map((donation) => (
              <li key={donation.id} className="donation-item">
                <div className="donation-detail">
                  <strong>{donation.donor} (ID: {donation.donorId})</strong> donated 
                  <span className="swipe-count">{donation.swipeCount} swipe(s)</span> to 
                  <strong>{donation.recipient} (ID: {donation.recipientId})</strong> on 
                  <span className="donation-date">{formatDate(donation.donatedAt)}</span>.
                </div>
                {donation.public && (
                  <div className="blockchain-id">
                    Blockchain ID: {donation.blockchainId}
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
