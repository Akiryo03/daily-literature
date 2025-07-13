// src/components/FirebaseTest.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Firestore に接続テスト
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setConnected(true);
        console.log('Firebase 接続成功！');
      } catch (err) {
        setError(err.message);
        console.error('Firebase 接続エラー:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
      <h3>Firebase 接続テスト</h3>
      {connected && <p style={{ color: 'green' }}>✅ Firebase に正常に接続されました</p>}
      {error && <p style={{ color: 'red' }}>❌ エラー: {error}</p>}
    </div>
  );
};

export default FirebaseTest;