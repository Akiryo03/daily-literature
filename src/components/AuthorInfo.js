import React from 'react';

const AuthorInfo = ({ authorInfo, isExpanded, onToggle }) => {
  return (
    <div className="detail-section author-section">
      <button
        onClick={onToggle}
        className="detail-toggle"
      >
        📚 作者について詳しく
      </button>
      {isExpanded && (
        <div className="detail-content">
          <div className="author-grid">
            <div>
              <h4 className="detail-subtitle">生い立ち・背景</h4>
              <p className="detail-text">{authorInfo.background}</p>
              <h4 className="detail-subtitle">文学的特徴</h4>
              <p className="detail-text">{authorInfo.literaryStyle}</p>
            </div>
            <div>
              <h4 className="detail-subtitle">主要作品</h4>
              <ul className="works-list">
                {authorInfo.majorWorks.map((work, index) => (
                  <li key={index} className="work-item">
                    <span className="work-bullet"></span>
                    {work}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;  