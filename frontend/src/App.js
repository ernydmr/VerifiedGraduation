import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [studentName, setStudentName] = useState('');
  const [certificateHash, setCertificateHash] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [error, setError] = useState(''); // Hata mesajlarını göstermek için

  // 📌 Belge Ekleme Fonksiyonu
  const addCertificate = async () => {
    try {
      if (!studentName || !certificateHash) {
        throw new Error('Öğrenci adı ve belge hash alanları doldurulmalıdır.');
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-certificate`, {
        studentName,
        certificateHash,
      });

      setError('');
      alert('✅ Belge başarıyla blokzincire eklendi!');
    } catch (error) {
      console.error('Belge ekleme hatası:', error);

      if (error.response) {
        // Backend'den gelen hata mesajı
        setError(`❌ Hata: ${error.response.data.error}`);
      } else if (error.request) {
        // Sunucuya istek gönderildi ama cevap alınamadı
        setError('❌ Sunucudan cevap alınamadı.');
      } else {
        // İstek gönderilemedi
        setError(`❌ Hata: ${error.message}`);
      }
    }
  };

  // 📌 Belge Doğrulama Fonksiyonu
  const verifyCertificate = async () => {
    try {
      if (!certificateHash) {
        throw new Error('Belge hash alanı doldurulmalıdır.');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/verify-certificate/${certificateHash}`
      );

      const date = new Date(response.data.timestamp);
      const formattedDate = date.toLocaleString();

      setVerificationResult(
        `🎓 Öğrenci Adı: ${response.data.studentName}, 📅 Zaman Damgası: ${formattedDate}`
      );
      setError('');
    } catch (error) {
      console.error('Belge doğrulama hatası:', error);

      if (error.response) {
        // Backend'den gelen hata mesajı
        setError(`❌ Hata: ${error.response.data.error}`);
      } else if (error.request) {
        // Sunucuya istek gönderildi ama cevap alınamadı
        setError('❌ Sunucudan cevap alınamadı.');
      } else {
        // İstek gönderilemedi
        setError(`❌ Hata: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 Mezuniyet Belgesi Sistemi</h1>

      {/* Belge Ekle */}
      <div>
        <h3>📥 Belge Ekle</h3>
        <input
          type="text"
          placeholder="Öğrenci Adı"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Belge Hash"
          value={certificateHash}
          onChange={(e) => setCertificateHash(e.target.value)}
        />
        <button onClick={addCertificate}>Belge Ekle</button>
      </div>

      {/* Belge Doğrula */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🔍 Belge Doğrula</h3>
        <input
          type="text"
          placeholder="Belge Hash"
          value={certificateHash}
          onChange={(e) => setCertificateHash(e.target.value)}
        />
        <button onClick={verifyCertificate}>Belge Doğrula</button>
        {verificationResult && <p>{verificationResult}</p>}
      </div>

      {/* Hata Mesajları */}
      {error && (
        <div style={{ marginTop: '2rem', color: 'red' }}>
          <h4>⚠️ Hata:</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
