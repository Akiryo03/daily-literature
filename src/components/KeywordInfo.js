import React from 'react';

const KeywordInfo = ({ keywords, isExpanded, onToggle }) => {
  return (
    <div className="detail-section keyword-section">
      <button
        onClick={onToggle}
        className="detail-toggle"
      >
        🔑 重要キーワード
      </button>
      {isExpanded && (
        <div className="detail-content">
          <div className="keywords-container">
            {keywords.map((keyword, index) => (
              <div key={index} className="keyword-item">
                <h4 className="keyword-title">{keyword.word}</h4>
                <p className="keyword-meaning">{keyword.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordInfo;