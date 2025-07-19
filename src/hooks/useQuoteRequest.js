// src/hooks/useQuoteRequest.js
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const useQuoteRequest = (userId) => {
  const [loading, setLoading] = useState(false);

  // リクエストを送信
  const submitRequest = async (requestData) => {
    if (!userId) {
      throw new Error('ユーザーが認証されていません');
    }

    setLoading(true);
    
    try {
      // Firestore にリクエストを保存
      const requestsCollection = collection(db, 'quoteRequests');
      
      const requestDoc = {
        // ユーザー情報
        userId: userId,
        
        // リクエスト内容
        quoteText: requestData.quoteText.trim(),
        author: requestData.author.trim(),
        work: requestData.work?.trim() || '',
        era: requestData.era || '',
        reason: requestData.reason.trim(),
        
        // 連絡先情報（任意）
        requesterName: requestData.requesterName?.trim() || '',
        email: requestData.email?.trim() || '',
        
        // システム情報
        status: 'pending', // pending, approved, rejected
        submittedAt: serverTimestamp(),
        reviewedAt: null,
        reviewerNotes: '',
        
        // メタデータ
        userAgent: navigator.userAgent,
        language: navigator.language,

         // 典拠情報（追加）
         bookTitle: requestData.bookTitle?.trim() || '',
         publisher: requestData.publisher?.trim() || '',
  
  // 連絡先情報（任意）
         requesterName: requestData.requesterName?.trim() || '',
         email: requestData.email?.trim() || '',
      };

      const docRef = await addDoc(requestsCollection, requestDoc);
      
      console.log('リクエスト送信成功:', docRef.id);
      
      return {
        success: true,
        requestId: docRef.id
      };
      
    } catch (error) {
      console.error('リクエスト送信エラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitRequest,
    loading
  };
};