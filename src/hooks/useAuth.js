// src/hooks/useAuth.js (改良版)
import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setError(null);
        console.log('ユーザーログイン:', user.uid, user.isAnonymous ? '(匿名)' : '(通常)');
      } else {
        // ユーザーがログインしていない場合、匿名ログインを試行
        console.log('ユーザーが未ログイン、匿名ログインを開始...');
        signInAnonymously(auth)
          .then((result) => {
            setUser(result.user);
            setError(null);
            console.log('匿名ユーザー作成成功:', result.user.uid);
          })
          .catch((error) => {
            console.error('匿名ログインエラー:', error);
            setError(error);
            
            // エラーの詳細情報を表示
            if (error.code === 'auth/configuration-not-found') {
              console.error('❌ Firebase Authentication が正しく設定されていません');
              console.error('解決方法: Firebase Console で匿名認証を有効にしてください');
            } else if (error.code === 'auth/operation-not-allowed') {
              console.error('❌ 匿名認証が有効になっていません');
              console.error('解決方法: Firebase Console → Authentication → Sign-in method → 匿名 を有効にしてください');
            }
          });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 手動で匿名ログインを再試行する関数
  const retryAnonymousSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
      console.log('匿名ログイン再試行成功:', result.user.uid);
    } catch (error) {
      console.error('匿名ログイン再試行エラー:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, retryAnonymousSignIn };
};