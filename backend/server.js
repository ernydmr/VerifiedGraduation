const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Blockchain Bağlantısı
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const contractABI = require('../artifacts/contracts/GraduationCertificate.sol/GraduationCertificate.json').abi;
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

let signer;
let contract;

async function initializeBlockchain() {
  try {
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('✅ Blockchain bağlantısı başarılı.');
  } catch (error) {
    console.error('❌ Blockchain bağlantı hatası:', error.message);
    process.exit(1);
  }
}

// 📌 MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB bağlantısı başarılı.'))
  .catch((error) => {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  });

// 📌 MongoDB Modeli
const certificateSchema = new mongoose.Schema({
  studentName: String,
  certificateHash: String,
  timestamp: Number,
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// 📌 Hata Orta Katmanı (Error Middleware)
function errorHandler(err, req, res, next) {
  console.error('❌ Hata:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Sunucu hatası oluştu.',
  });
}

// 📌 Belge Ekleme API
app.post('/add-certificate', async (req, res, next) => {
  const { studentName, certificateHash } = req.body;

  try {
    if (!studentName || !certificateHash) {
      throw { status: 400, message: 'Öğrenci adı ve belge hash bilgisi zorunludur.' };
    }

    const accounts = await provider.listAccounts();
    if (!accounts || accounts.length === 0) {
      throw { status: 500, message: 'Blockchain hesabı bulunamadı.' };
    }

    const tx = await contract.addCertificate(studentName, certificateHash, { from: accounts[0] });
    await tx.wait();

    const newCert = new Certificate({
      studentName,
      certificateHash,
      timestamp: Date.now(),
    });
    await newCert.save();

    res.status(200).json({ message: '✅ Belge başarıyla blokzincire ve veritabanına eklendi.' });
  } catch (error) {
    if (error.reason) {
      return next({ status: 400, message: `Blockchain Hatası: ${error.reason}` });
    } else if (error.code === 11000) {
      return next({ status: 400, message: 'Bu belge hash zaten mevcut.' });
    }
    next(error);
  }
});

// 📌 Belge Doğrulama API
app.get('/verify-certificate/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      throw { status: 400, message: 'Belge hash bilgisi zorunludur.' };
    }

    const result = await contract.verifyCertificate(hash);

    if (!result || !result[0]) {
      throw { status: 404, message: 'Belge bulunamadı.' };
    }

    res.status(200).json({
      studentName: result[0],
      timestamp: Number(result[1]) * 1000, // Milisaniyeye çevir
    });
  } catch (error) {
    if (error.reason) {
      return next({ status: 400, message: `Blockchain Hatası: ${error.reason}` });
    }
    next(error);
  }
});

// 📌 Hata Orta Katmanı
app.use(errorHandler);

// 📌 Sunucu Başlat
initializeBlockchain().then(() => {
  app.listen(3000, () => {
    console.log('✅ Backend sunucusu 3000 portunda çalışıyor');
  });
});
