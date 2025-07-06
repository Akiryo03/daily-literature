import React from 'react';

const ExamPoints = ({ examPoints, isExpanded, onToggle }) => {
  return (
    <div className="detail-section exam-section">
      <button
        onClick={onToggle}
        className="detail-toggle"
      >
        📝 ポイント
      </button>
      {isExpanded && (
        <div className="detail-content">
          <div className="exam-points-container">
            {examPoints.map((point, index) => (
              <div key={index} className="exam-point">
                <span className="exam-number">
                  {index + 1}
                </span>
                <p className="exam-text">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPoints;