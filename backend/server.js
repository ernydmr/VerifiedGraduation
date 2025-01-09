const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const mongoose = require('mongoose'); // Database connection to MongoDB 
const multer = require('multer');     // For pdf uploading
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Blockchain Connection
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Connects to a local Ethereum node
const contractABI = require('../artifacts/contracts/GraduationCertificate.sol/GraduationCertificate.json').abi; // ABI defines the contract's methods and events
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Address of the deployed smart contract

let signer;
let contract;

async function initializeBlockchain() {
  try {
    signer = provider.getSigner(); // Retrieves the default signer from the connected Ethereum provider
    contract = new ethers.Contract(contractAddress, contractABI, signer); // Initializes the contract instance with its ABI, address, and signer
    console.log('✅ Blockchain connection successful.');
  } catch (error) {
    console.error('❌ Blockchain connection error:', error.message);
    process.exit(1);
  }
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connection successful.'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

//  MongoDB Models
const certificateSchema = new mongoose.Schema({
  studentName: String,
  certificateHash: String,
  timestamp: Number,
});

const pdfSchema = new mongoose.Schema({
  hashId: String,       
  fileName: String,     
  filePath: String,     
  uploadDate: { type: Date, default: Date.now },
});

const Certificate = mongoose.model('Certificate', certificateSchema);
const PDFDocument = mongoose.model('PDFDocument', pdfSchema);

// PDF Upload Middleware (Multer)
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Maximum file size: 5 MB
});


//  Error Handling Middleware
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'An error occurred on the server.',
  });
}




//  Blockchain APIs

//  Add Certificate to Blockchain and Database

app.post('/add-certificate', async (req, res, next) => {
  const { studentName, certificateHash } = req.body;

  try {
    if (!studentName || !certificateHash) {
      throw { status: 400, message: 'Student name and certificate hash are required.' };
    }

    const accounts = await provider.listAccounts();
    if (!accounts || accounts.length === 0) {
      throw { status: 500, message: 'No blockchain account found.' };
    }

    // Add the certificate to the blockchain by invoking the smart contract method
    const tx = await contract.addCertificate(studentName, certificateHash, { from: accounts[0] });
    await tx.wait();
     
    const newCert = new Certificate({            // Save the certificate details to the MongoDB database
      studentName,
      certificateHash,
      timestamp: Date.now(),
    });
    await newCert.save();

    res.status(200).json({ message: '✅ Certificate successfully added to blockchain and database.' });
  } catch (error) {
    console.error('Error adding certificate:', error);

    if (error?.error?.message?.includes('Certificate already exists')) {
      return res.status(400).json({ error: 'Certificate already exists' });
    }

    next(error);
  }
});


//  Verify Certificate
app.get('/verify-certificate/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      throw { status: 400, message: 'Certificate hash is required.' };
    }

    const result = await contract.verifyCertificate(hash);      //the smart contract method to verify the certificate


    if (!result || !result[0]) {
      throw { status: 404, message: 'Certificate not found.' };
    }

    res.status(200).json({
      studentName: result[0],
      timestamp: Number(result[1]) * 1000,  //Convert blockchain timestamp to milliseconds
    });
  } catch (error) {
    next(error);
  }
});

//  Retrieve All Blockchain Transactions
app.get('/get-all-transactions', async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();               // Get the latest block number
    const transactions = [];

    for (let i = 0; i <= blockNumber; i++) {
      const block = await provider.getBlockWithTransactions(i);        // Fetch block details along with transactions

      for (const tx of block.transactions) {
        const receipt = await provider.getTransactionReceipt(tx.hash); // Get the receipt of the transaction
        let studentName = 'Unknown'; 
        let certificateHash = 'Unknown';                               // Default value if certificate hash is not found

        if (receipt && receipt.logs.length > 0) {
          for (const log of receipt.logs) {
            try {
              const parsedLog = contract.interface.parseLog(log);     // Parses the event log emitted by the contract

              if (parsedLog && parsedLog.name === 'CertificateAdded') {
                studentName = parsedLog.args.studentName || 'Unknown';
                certificateHash = parsedLog.args.certificateHash || 'Unknown';
              }
            } catch (error) {
              continue;
            }
          }
        }

        transactions.push({                                     // Add transaction details to the array
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.utils.formatEther(tx.value),
          timestamp: block.timestamp * 1000,
          blockNumber: tx.blockNumber,
          studentName,
          certificateHash,
        });
      }
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Blockchain transaction error:', error.message);
    res.status(500).json({ error: 'Error occurred while fetching blockchain transactions.' });
  }
});


// PDF Upload API
app.post('/upload-pdf', upload.single('pdf'), async (req, res, next) => {
  try {
    const { hashId } = req.body;

    if (!hashId) {
      throw { status: 400, message: 'Hash ID is required.' };
    }

    const newPDF = new PDFDocument({
      hashId,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    await newPDF.save();

    res.status(200).json({
      message: '✅ PDF file successfully uploaded and saved to the database.',
    });
  } catch (error) {
    next(error);
  }
});


// List PDFs API
app.get('/list-pdfs', async (req, res, next) => {
  try {
    const pdfs = await PDFDocument.find({});
    res.status(200).json({ pdfs });
  } catch (error) {
    next(error);
  }
});

// View PDF API
app.get('/view-pdf/:id', async (req, res, next) => {
  try {
    const pdf = await PDFDocument.findById(req.params.id);
    if (!pdf) throw { status: 404, message: 'PDF file not found.' };

    res.sendFile(pdf.filePath, { root: '.' });
  } catch (error) {
    next(error);
  }
});
//  Error Handling Middleware
app.use(errorHandler);

//  Start Server
initializeBlockchain().then(() => {
  app.listen(3000, () => {
    console.log('✅ Backend server running on port 3000');
  });
});