import React from 'react';
import AuthorInfo from './AuthorInfo';
import KeywordInfo from './KeywordInfo';
import ExamPoints from './ExamPoints';

const DetailedInfo = ({ quote, expandedSection, onToggleSection }) => {
  return (
    <div className="detailed-info">
      <AuthorInfo 
        authorInfo={quote.authorInfo}
        isExpanded={expandedSection === 'author'}
        onToggle={() => onToggleSection('author')}
      />
      
      <KeywordInfo 
        keywords={quote.keywords}
        isExpanded={expandedSection === 'keywords'}
        onToggle={() => onToggleSection('keywords')}
      />
      
      <ExamPoints 
        examPoints={quote.examPoints}
        isExpanded={expandedSection === 'exam'}
        onToggle={() => onToggleSection('exam')}
      />
    </div>
  );
};

export default DetailedInfo;