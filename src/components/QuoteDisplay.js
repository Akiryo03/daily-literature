// src/components/QuoteDisplay.js
import React from 'react';
import { User, BookmarkIcon, ExternalLink, Lightbulb, Share2 } from 'lucide-react';

const QuoteDisplay = ({ quote, onShare }) => {
  return (
    <div className="quote-display">
      <blockquote className="quote-text">
        「{quote.text}」
      </blockquote>

      {/* 基本情報 */}
      <div className="quote-info-grid">
        <div className="info-card author-card">
          <h3 className="info-title">
            <User className="info-icon" />
            作者
          </h3>
          <p className="info-name">{quote.author}</p>
          <p className="info-detail">{quote.authorInfo.lifespan}</p>
        </div>
        
        <div className="info-card work-card">
          <h3 className="info-title">
            <BookmarkIcon className="info-icon" />
            作品
          </h3>
          <p className="info-name">{quote.work || '格言・語録'}</p>
          <p className="info-detail">{quote.era}</p>
        </div>
        
        <div className="info-card source-card">
          <h3 className="info-title">
            <ExternalLink className="info-icon" />
            出典
          </h3>
          <p className="info-name">{quote.source}</p>
          <p className="info-detail">{quote.workInfo.genre}</p>
        </div>
      </div>

      {/* 解説 */}
      <div className="quote-explanation">
        <h3 className="explanation-title">
          <Lightbulb className="explanation-icon" />
          この名文について
        </h3>
        <p className="explanation-text">{quote.meaning}</p>
      </div>

      {/* 共有ボタン */}
      {onShare && (
        <div className="quote-share-section">
          <button onClick={() => onShare(quote)} className="quote-share-button">
            <Share2 className="share-button-icon" />
            この名文を共有
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;