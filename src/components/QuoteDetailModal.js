// src/components/QuoteDetailModal.js
import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Calendar, ExternalLink, Lightbulb, Heart } from 'lucide-react';
import AuthorInfo from './AuthorInfo';
import KeywordInfo from './KeywordInfo';
import ExamPoints from './ExamPoints';

const QuoteDetailModal = ({ quote, isOpen, onClose, isFromFavorites = false }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  // モーダルが開いた時にbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen || !quote) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* モーダルヘッダー */}
        <div className="modal-header">
          <div className="modal-title">
            <Heart className="modal-title-icon" />
            <span>名文詳細</span>
          </div>
          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label="閉じる"
          >
            <X className="close-icon" />
          </button>
        </div>

        {/* モーダルボディ */}
        <div className="modal-body">
          {/* 名文表示 */}
          <div className="modal-quote-display">
            <blockquote className="modal-quote-text">
              「{quote.text}」
            </blockquote>

            {/* 基本情報グリッド */}
            <div className="modal-info-grid">
              <div className="modal-info-card author-card">
                <h3 className="modal-info-title">
                  <User className="info-icon" />
                  作者
                </h3>
                <p className="modal-info-name">{quote.author}</p>
                <p className="modal-info-detail">{quote.authorInfo?.lifespan || ''}</p>
              </div>
              
              <div className="modal-info-card work-card">
                <h3 className="modal-info-title">
                  <BookOpen className="info-icon" />
                  作品
                </h3>
                <p className="modal-info-name">{quote.work || '格言・語録'}</p>
                <p className="modal-info-detail">{quote.era || ''}</p>
              </div>
              
              <div className="modal-info-card source-card">
                <h3 className="modal-info-title">
                  <ExternalLink className="info-icon" />
                  出典
                </h3>
                <p className="modal-info-name">{quote.source || '古典'}</p>
                <p className="modal-info-detail">{quote.workInfo?.genre || ''}</p>
              </div>
            </div>

            {/* 解説 */}
            {quote.meaning && (
              <div className="modal-explanation">
                <h3 className="modal-explanation-title">
                  <Lightbulb className="explanation-icon" />
                  この名文について
                </h3>
                <p className="modal-explanation-text">{quote.meaning}</p>
              </div>
            )}

            {/* お気に入りから表示の場合の追加情報 */}
            {isFromFavorites && quote.addedAt && (
              <div className="modal-favorite-info">
                <Calendar className="favorite-info-icon" />
                <span>
                  お気に入り追加日: {new Date(quote.addedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* 詳細情報セクション */}
          {(quote.authorInfo || quote.keywords || quote.examPoints) && (
            <div className="modal-detailed-info">
              <h3 className="modal-section-title">詳細情報</h3>
              
              {quote.authorInfo && (
                <AuthorInfo 
                  authorInfo={quote.authorInfo}
                  isExpanded={expandedSection === 'author'}
                  onToggle={() => toggleSection('author')}
                />
              )}
              
              {quote.keywords && (
                <KeywordInfo 
                  keywords={quote.keywords}
                  isExpanded={expandedSection === 'keywords'}
                  onToggle={() => toggleSection('keywords')}
                />
              )}
              
              {quote.examPoints && (
                <ExamPoints 
                  examPoints={quote.examPoints}
                  isExpanded={expandedSection === 'exam'}
                  onToggle={() => toggleSection('exam')}
                />
              )}
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="modal-footer">
          <button onClick={onClose} className="modal-footer-button">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;