// src/components/QuoteDetailModal.js
import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Calendar, ExternalLink, Lightbulb, Heart } from 'lucide-react';
import AuthorInfo from './AuthorInfo';
import KeywordInfo from './KeywordInfo';
import ExamPoints from './ExamPoints';
import { getCompleteQuoteData } from './utils/quoteUtils';

const QuoteDetailModal = ({ quote, isOpen, onClose, isFromFavorites = false }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [completeQuote, setCompleteQuote] = useState(null);

  // お気に入りから開いた場合、完全なデータを取得
  useEffect(() => {
    if (isOpen && quote) {
      if (isFromFavorites) {
        const fullQuoteData = getCompleteQuoteData(quote);
        setCompleteQuote(fullQuoteData);
      } else {
        setCompleteQuote(quote);
      }
    }
  }, [isOpen, quote, isFromFavorites]);

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

  if (!isOpen || !completeQuote) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* モーダルヘッダー */}
        <div className="modal-header">
          <div className="modal-title">
            <Heart className="modal-title-icon" />
            <span>名文詳細</span>
            {isFromFavorites && (
              <span className="modal-favorite-badge">お気に入り</span>
            )}
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
              「{completeQuote.text}」
            </blockquote>

            {/* 基本情報グリッド */}
            <div className="modal-info-grid">
              <div className="modal-info-card author-card">
                <h3 className="modal-info-title">
                  <User className="info-icon" />
                  作者
                </h3>
                <p className="modal-info-name">{completeQuote.author}</p>
                <p className="modal-info-detail">{completeQuote.authorInfo?.lifespan || ''}</p>
              </div>
              
              <div className="modal-info-card work-card">
                <h3 className="modal-info-title">
                  <BookOpen className="info-icon" />
                  作品
                </h3>
                <p className="modal-info-name">{completeQuote.work || '格言・語録'}</p>
                <p className="modal-info-detail">{completeQuote.era || ''}</p>
              </div>
              
              <div className="modal-info-card source-card">
                <h3 className="modal-info-title">
                  <ExternalLink className="info-icon" />
                  出典
                </h3>
                <p className="modal-info-name">{completeQuote.source || '古典'}</p>
                <p className="modal-info-detail">{completeQuote.workInfo?.genre || ''}</p>
              </div>
            </div>

            {/* 解説 */}
            {completeQuote.meaning && (
              <div className="modal-explanation">
                <h3 className="modal-explanation-title">
                  <Lightbulb className="explanation-icon" />
                  この名文について
                </h3>
                <p className="modal-explanation-text">{completeQuote.meaning}</p>
              </div>
            )}

            {/* お気に入りから表示の場合の追加情報 */}
            {isFromFavorites && completeQuote.addedAt && (
              <div className="modal-favorite-info">
                <Calendar className="favorite-info-icon" />
                <span>
                  お気に入り追加日: {new Date(completeQuote.addedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* 詳細情報セクション */}
          <div className="modal-detailed-info">
            <h3 className="modal-section-title">詳細情報</h3>
            
            {/* 作者について詳しく */}
            {completeQuote.authorInfo && (
              <AuthorInfo 
                authorInfo={completeQuote.authorInfo}
                isExpanded={expandedSection === 'author'}
                onToggle={() => toggleSection('author')}
              />
            )}
            
            {/* 重要キーワード */}
            {completeQuote.keywords && (
              <KeywordInfo 
                keywords={completeQuote.keywords}
                isExpanded={expandedSection === 'keywords'}
                onToggle={() => toggleSection('keywords')}
              />
            )}
            
            {/* ポイント */}
            {completeQuote.examPoints && (
              <ExamPoints 
                examPoints={completeQuote.examPoints}
                isExpanded={expandedSection === 'exam'}
                onToggle={() => toggleSection('exam')}
              />
            )}
          </div>
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