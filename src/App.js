// src/App.jsx (完全版)
import React, { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Calendar, Heart } from 'lucide-react';
import Header from './components/Header';
import QuoteDisplay from './components/QuoteDisplay';
import DetailedInfo from './components/DetailedInfo';
import FavoriteButton from './components/FavoriteButton';
import FavoritesList from './components/FavoritesList';
import AuthError from './components/AuthError';
import { generateLiteratureQuotes } from './data/literatureData';
import { formatDate } from './utils/dateUtils';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import './styles/App.css';

const DailyLiteratureApp = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const literatureQuotes = generateLiteratureQuotes();

  // Firebase認証とお気に入り管理
  const { user, loading: authLoading, error: authError, retryAnonymousSignIn } = useAuth();
  const { 
    favorites, 
    loading: favoritesLoading, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavorites(user?.uid);

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

  // お気に入りトグル
  const handleFavoriteToggle = (quote) => {
    if (isFavorite(quote)) {
      const quoteId = `${quote.author}_${quote.text.slice(0, 20)}`.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龯]/g, '');
      removeFromFavorites(quoteId);
    } else {
      addToFavorites(quote);
    }
  };

  // メインビューとお気に入りビューの切り替え
  const toggleView = () => {
    setShowFavorites(!showFavorites);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const today = new Date();
    setCurrentDate(formatDate(today));
    setCurrentQuote(getQuoteOfTheDay());
  }, []);

  // 認証エラーの表示
  if (authError && !user) {
    return (
      <div className="app-container">
        <AuthError error={authError} onRetry={retryAnonymousSignIn} />
      </div>
    );
  }

  // 認証中のローディング
  if (authLoading) {
    return (
      <div className="app-container">
        <div className="loading">認証中...</div>
      </div>
    );
  }

  if (!currentQuote) {
    return (
      <div className="app-container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="container">
        <Header 
          currentDate={currentDate} 
          onRefresh={handleRefresh}
          onToggleView={toggleView}
          showFavorites={showFavorites}
          favoritesCount={favorites.length}
        />
        
        <main className="main-content">
          {showFavorites ? (
            <FavoritesList 
              favorites={favorites}
              onRemove={removeFromFavorites}
              loading={favoritesLoading}
            />
          ) : (
            <>
              <QuoteDisplay quote={currentQuote} />
              
              {/* お気に入りボタン */}
              <div className="favorite-section">
                <FavoriteButton
                  quote={currentQuote}
                  isFavorite={isFavorite(currentQuote)}
                  onToggle={handleFavoriteToggle}
                  loading={favoritesLoading}
                />
              </div>
              
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
            </>
          )}
          
          <footer className="footer">
            <p>古くて新しい言葉たちに親しみましょう</p>
            {user && !showFavorites && (
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#6b7280' }}>
                お気に入り: {favorites.length} 件
              </p>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DailyLiteratureApp;