import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]); // State to store blockchain transactions
  const [error, setError] = useState(''); // State to handle error messages
  const [loading, setLoading] = useState(true); // State to indicate loading status

  // Fetch blockchain transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // API call to fetch all transactions
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-transactions`
        );
        setTransactions(response.data.transactions);
        setError('');
      } catch (error) {
        console.error('Error fetching blockchain transactions:', error);
        setError('❌ An error occurred while fetching blockchain transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container">
      <h1>🔗 All Blockchain Transactions</h1>
      {loading && <p>⏳ Loading transactions...</p>}
      {error && <div className="error">{error}</div>}

      {/* If no transactions exist */}
      {!loading && transactions.length === 0 && (
        <p>📭 No transactions found yet.</p>
      )}

      {/* Display transaction table if transactions exist */}
      {!loading && transactions.length > 0 && (
        <div className="transaction-table">
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Amount (ETH)</th>
                <th>Time</th>
                <th>Block No</th>
                <th>Student Name</th>
                <th>Certificate Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.hash}...</td> {/* Transaction hash */}
                  <td>{tx.from || 'N/A'}</td> {/* Sender address */}
                  <td>{tx.to || 'N/A'}</td> {/* Recipient address */}
                  <td>{tx.value}</td> {/* Transaction value in ETH */}
                  <td>{new Date(tx.timestamp).toLocaleString()}</td> {/* Transaction timestamp */}
                  <td>{tx.blockNumber}</td> {/* Block number */}
                  <td>{tx.studentName || 'Unknown'}</td> {/* Student name associated with the transaction */}
                  <td>{tx.certificateHash || 'Unknown'}</td> {/* Certificate hash associated with the transaction */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Transactions;
