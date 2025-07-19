// src/components/QuoteRequest.js
import React, { useState } from 'react';
import { X, Send, BookOpen, User, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const QuoteRequest = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    quoteText: '',
    author: '',
    work: '',
    era: '',
    reason: '',
    requesterName: '',
    email: '',
    publisher: '',
    bookTitle: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // フォームデータの更新
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors = {};

    if (!formData.quoteText.trim()) {
      newErrors.quoteText = '名文を入力してください';
    } else if (formData.quoteText.length < 10) {
      newErrors.quoteText = '名文は10文字以上入力してください';
    }

    if (!formData.author.trim()) {
      newErrors.author = '作者名を入力してください';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'この名文を推薦する理由を入力してください';
    } else if (formData.reason.length < 20) {
      newErrors.reason = '推薦理由は20文字以上入力してください';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // メールアドレスのバリデーション
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // リクエストデータを整形
      const requestData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      await onSubmit(requestData);
      setSubmitSuccess(true);
      
      // 3秒後にモーダルを閉じる
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error('リクエスト送信エラー:', error);
      setErrors({ submit: 'リクエストの送信に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルを閉じる
  const handleClose = () => {
    setFormData({
      quoteText: '',
      author: '',
      work: '',
      era: '',
      reason: '',
      requesterName: '',
      email: '',
      publisher: '',
      bookTitle: ''
    });
    setErrors({});
    setSubmitSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  // ESCキーでモーダルを閉じる
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // モーダルが開いた時にbodyのスクロールを無効化
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 送信成功画面
  if (submitSuccess) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content request-success" onClick={(e) => e.stopPropagation()}>
          <div className="success-content">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">リクエストを送信しました！</h2>
            <p className="success-message">
              素晴らしい名文のご提案をありがとうございます。<br />
              内容を確認させていただき、採用された場合はアプリに追加いたします。
            </p>
            <button onClick={handleClose} className="success-button">
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content request-modal" onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen className="modal-title-icon" />
            <span>名文追加リクエスト</span>
          </div>
          <button onClick={handleClose} className="modal-close-button">
            <X className="close-icon" />
          </button>
        </div>

        {/* ボディ */}
        <div className="modal-body">
          <div className="request-intro">
            <p>
              アプリに追加したい素晴らしい名文がありましたら、ぜひご提案ください。
              皆様からのリクエストにより、より充実した名文コレクションを作り上げていきます。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="request-form">
            {/* 名文 */}
            <div className="form-group">
              <label className="form-label required">
                <FileText className="label-icon" />
                名文
              </label>
              <textarea
                value={formData.quoteText}
                onChange={(e) => handleInputChange('quoteText', e.target.value)}
                placeholder="追加したい名文を入力してください..."
                className={`form-textarea ${errors.quoteText ? 'error' : ''}`}
                rows={4}
              />
              {errors.quoteText && (
                <div className="form-error">
                  <AlertCircle className="error-icon" />
                  {errors.quoteText}
                </div>
              )}
            </div>

            {/* 作者名 */}
            <div className="form-group">
              <label className="form-label required">
                <User className="label-icon" />
                作者名
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="作者名を入力してください"
                className={`form-input ${errors.author ? 'error' : ''}`}
              />
              {errors.author && (
                <div className="form-error">
                  <AlertCircle className="error-icon" />
                  {errors.author}
                </div>
              )}
            </div>

            {/* 作品名・時代（任意） */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <BookOpen className="label-icon" />
                  作品名（任意）
                </label>
                <input
                  type="text"
                  value={formData.work}
                  onChange={(e) => handleInputChange('work', e.target.value)}
                  placeholder="作品名（例：源氏物語）"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar className="label-icon" />
                  時代（任意）
                </label>
                <select
                  value={formData.era}
                  onChange={(e) => handleInputChange('era', e.target.value)}
                  className="form-select"
                >
                  <option value="">時代を選択</option>
                  <option value="平安時代">平安時代</option>
                  <option value="鎌倉時代">鎌倉時代</option>
                  <option value="室町時代">室町時代</option>
                  <option value="江戸時代">江戸時代</option>
                  <option value="明治時代">明治時代</option>
                  <option value="大正時代">大正時代</option>
                  <option value="昭和時代">昭和時代</option>
                  <option value="平成時代">平成時代</option>
                  <option value="令和時代">令和時代</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            {/* 典拠情報（任意） */}
            <div className="form-section">
              <h4 className="form-section-title">典拠情報（任意）</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <BookOpen className="label-icon" />
                    書籍名
                  </label>
                  <input
                    type="text"
                    value={formData.bookTitle}
                    onChange={(e) => handleInputChange('bookTitle', e.target.value)}
                    placeholder="書籍名（例：新潮文庫 源氏物語）"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FileText className="label-icon" />
                    出版社
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    placeholder="出版社名（例：新潮社）"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* 推薦理由 */}
            <div className="form-group">
              <label className="form-label required">
                <FileText className="label-icon" />
                推薦理由
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="この名文を推薦する理由や、心に響いたポイントを教えてください..."
                className={`form-textarea ${errors.reason ? 'error' : ''}`}
                rows={3}
              />
              {errors.reason && (
                <div className="form-error">
                  <AlertCircle className="error-icon" />
                  {errors.reason}
                </div>
              )}
            </div>

            {/* 連絡先（任意） */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User className="label-icon" />
                  お名前（任意）
                </label>
                <input
                  type="text"
                  value={formData.requesterName}
                  onChange={(e) => handleInputChange('requesterName', e.target.value)}
                  placeholder="お名前またはニックネーム"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText className="label-icon" />
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && (
                  <div className="form-error">
                    <AlertCircle className="error-icon" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* 送信エラー */}
            {errors.submit && (
              <div className="form-error submit-error">
                <AlertCircle className="error-icon" />
                {errors.submit}
              </div>
            )}

            {/* 注意事項 */}
            <div className="request-notice">
              <p className="notice-text">
                ※ 著作権保護のため、可能な限り典拠情報をご記載ください。<br />
                ※ 送信いただいた情報は、名文追加の検討目的のみに使用いたします。
              </p>
            </div>
          </form>
        </div>

        {/* フッター */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={handleClose}
            className="cancel-button"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>送信中...</>
            ) : (
              <>
                <Send className="send-icon" />
                リクエストを送信
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequest;