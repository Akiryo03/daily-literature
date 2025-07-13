// src/components/AuthError.js
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const AuthError = ({ error, onRetry }) => {
  const getErrorMessage = (error) => {
    switch (error?.code) {
      case 'auth/configuration-not-found':
        return {
          title: 'Firebase設定エラー',
          message: 'Firebase Authentication が正しく設定されていません。',
          solution: 'Firebase Console でプロジェクトの設定を確認してください。'
        };
      case 'auth/operation-not-allowed':
        return {
          title: '匿名認証が無効です',
          message: 'Firebase Console で匿名認証が有効になっていません。',
          solution: 'Authentication → Sign-in method → 匿名 を有効にしてください。'
        };
      default:
        return {
          title: '認証エラー',
          message: error?.message || '認証に失敗しました。',
          solution: 'しばらく時間をおいてから再試行してください。'
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="auth-error">
      <div className="auth-error-content">
        <AlertCircle className="auth-error-icon" />
        <h3 className="auth-error-title">{errorInfo.title}</h3>
        <p className="auth-error-message">{errorInfo.message}</p>
        <p className="auth-error-solution">{errorInfo.solution}</p>
        
        <button onClick={onRetry} className="auth-retry-button">
          <RefreshCw className="retry-icon" />
          再試行
        </button>
        
        <details className="auth-error-details">
          <summary>技術的な詳細</summary>
          <code className="auth-error-code">
            エラーコード: {error?.code}<br />
            メッセージ: {error?.message}
          </code>
        </details>
      </div>
    </div>
  );
};

export default AuthError;