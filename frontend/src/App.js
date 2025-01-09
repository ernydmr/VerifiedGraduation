import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Transactions from './Transactions'; // Blockchain transactions page

function App() {
  //  Blockchain States
  const [studentName, setStudentName] = useState(''); // Student name for adding a certificate
  const [certificateHash, setCertificateHash] = useState(''); // Hash for the certificate
  const [verificationResult, setVerificationResult] = useState(''); // Result of certificate verification
  const [error, setError] = useState(''); // General error messages
  const [verifyError, setVerifyError] = useState(''); // Errors specific to verification
  const [showTransactions, setShowTransactions] = useState(false); // Toggle for transactions page

  //  PDF
  const [pdfHashId, setPdfHashId] = useState(''); // Unique ID for the PDF
  const [pdfFile, setPdfFile] = useState(null); // PDF file object
  const [pdfs, setPdfs] = useState([]); // List of uploaded PDFs
  const [pdfError, setPdfError] = useState(''); // Error messages related to PDFs

  //  Blockchain: Adding a Certificate
  const addCertificate = async () => {
    try {
      if (!studentName || !certificateHash) {
        throw new Error('Student name and certificate hash fields must be filled.');
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-certificate`, {
        studentName,
        certificateHash,
      });

      setError('');
      alert('✅ Certificate successfully added to the blockchain!');
    } catch (error) {
      console.error('Error adding certificate:', error);

      if (error.response?.data?.error === 'Certificate already exists') {
        setError('❌ Certificate already exists');
      } else {
        setError(`❌ ${error.response?.data?.error || error.message}`);
      }
    }
  };

  
  //  Blockchain: Verifying a Certificate
  const verifyCertificate = async () => {
    try {
      if (!certificateHash) {
        throw new Error('Certificate hash field must be filled.');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/verify-certificate/${certificateHash}`
      );

      const date = new Date(response.data.timestamp);
      const formattedDate = date.toLocaleString();

      setVerificationResult(
        `🎓 Student Name: ${response.data.studentName}, 📅 Timestamp: ${formattedDate}`
      );
      setVerifyError(''); // Clear verification errors
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerifyError(`❌ ${error.response?.data?.error || error.message}`);
    }
  };

  
  //  Blockchain: Fetching All Transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/get-all-transactions`
      );
      console.log('Blockchain Transactions:', response.data.transactions);
    } catch (error) {
      console.error('Error fetching blockchain transactions:', error);
      setError('❌ Error occurred while fetching blockchain transactions.');
    }
  };


  //Uploading a File
  const uploadPDF = async () => {
    try {
      if (!pdfHashId || !pdfFile) {
        throw new Error('Hash ID and PDF file are required.');
      }

      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('hashId', pdfHashId);

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload-pdf`, formData);

      alert('✅ PDF file successfully uploaded!');
      fetchPdfs(); // Update the PDF list
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setPdfError(`❌ ${error.response?.data?.error || error.message}`);
    }
  };

  //Fetching List of Uploaded PDFs
  const fetchPdfs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/list-pdfs`);
      setPdfs(response.data.pdfs);
    } catch (error) {
      console.error('Error fetching PDF list:', error);
      setPdfError('❌ Error occurred while fetching the PDF list.');
    }
  };

  //Viewing a File
  const viewPDF = (id) => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/view-pdf/${id}`, '_blank');
  };

  //Initialize data on page load
  useEffect(() => {
    fetchTransactions();
    fetchPdfs();
  }, []);

  return (
    <div className="container">
      <h1>🎓 Graduation Certificate System</h1>

      {/* Page Navigation */}
      <button onClick={() => setShowTransactions(!showTransactions)}>
        {showTransactions ? '🏠 Home' : '🔗 View Blockchain Transactions'}
      </button>

      {showTransactions ? (
        <Transactions />
      ) : (
        <>
          {/* Blockchain Operations */}
          <h3>📥 Add Certificate</h3>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Certificate Hash"
            value={certificateHash}
            onChange={(e) => setCertificateHash(e.target.value)}
          />
          <button onClick={addCertificate}>Add Certificate</button>
          {error && <div className="error">{error}</div>}

          <h3>🔍 Verify Certificate</h3>
          <input
            type="text"
            placeholder="Certificate Hash"
            value={certificateHash}
            onChange={(e) => setCertificateHash(e.target.value)}
          />
          <button onClick={verifyCertificate}>Verify Certificate</button>
          {verificationResult && <div className="result">{verificationResult}</div>}
          {verifyError && <div className="error">{verifyError}</div>}

          {/* PDF Operations */}
          <h3>📤 Upload PDF</h3>
          <input
            type="text"
            placeholder="Hash ID"
            value={pdfHashId}
            onChange={(e) => setPdfHashId(e.target.value)}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
          <button onClick={uploadPDF}>Upload PDF</button>
          {pdfError && <div className="error">{pdfError}</div>}

          <h3>📑 PDF List</h3>
          <ul>
            {pdfs.map((pdf) => (
              <li key={pdf._id}>
                {pdf.fileName} - {pdf.hashId}
                <button onClick={() => viewPDF(pdf._id)}>View</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <footer>
        © {new Date().getFullYear()} Verified Graduation
      </footer>
    </div>
  );
}

export default App;
