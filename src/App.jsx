import React, { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Calendar } from 'lucide-react';
import Header from './components/Header';
import QuoteDisplay from './components/QuoteDisplay';
import DetailedInfo from './components/DetailedInfo';
import { generateLiteratureQuotes } from './data/literatureData';
import { formatDate } from './utils/dateUtils';
import './styles/App.css';

const DailyLiteratureApp = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const literatureQuotes = generateLiteratureQuotes();

  // 日付に基づいて名文を選択する関数
  const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % literatureQuotes.length;
    return literatureQuotes[index];
  };

  // 手動で更新する関数
  const handleRefresh = () => {
    const randomIndex = Math.floor(Math.random() * literatureQuotes.length);
    setCurrentQuote(literatureQuotes[randomIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // セクションの展開/折りたたみ
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    const today = new Date();
    setCurrentDate(formatDate(today));
    setCurrentQuote(getQuoteOfTheDay());
  }, []);

  if (!currentQuote) return <div className="loading">読み込み中...</div>;

  return (
    <div className="app-container">
   <div className="container">
  <Header currentDate={currentDate} onRefresh={handleRefresh} />
  <main className="main-content">
    <QuoteDisplay quote={currentQuote} />
    <DetailedInfo 
      quote={currentQuote}
      expandedSection={expandedSection}
      onToggleSection={toggleSection}
    />
    <div className="refresh-section">
      <button
        onClick={handleRefresh}
        className="refresh-button"
      >
        <RefreshCw className="refresh-icon" />
        別の名文を見る
      </button>
    </div>
    <footer className="footer">
      <p>古くて新しい言葉たちに親しみましょう</p>
    </footer>
  </main>
</div>
    </div>
  );
};

export default DailyLiteratureApp;