// src/App.js の修正版（フッターコンポーネント統合）
import React, { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Calendar, Heart } from 'lucide-react';
import Header from './components/Header';
import QuoteDisplay from './components/QuoteDisplay';
import DetailedInfo from './components/DetailedInfo';
import FavoriteButton from './components/FavoriteButton';
import FavoritesList from './components/FavoritesList';
import QuoteSearch from './components/QuoteSearch';
import QuoteRequest from './components/QuoteRequest';
import ShareQuote from './components/ShareQuote';
import InstallPrompt from './components/InstallPrompt';
import AuthError from './components/AuthError';
import Footer from './components/Footer'; // 追加
import { generateLiteratureQuotes } from './data/literatureData';
import { formatDate } from './utils/dateUtils';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { useQuoteRequest } from './hooks/useQuoteRequest';
import './styles/App.css';

const DailyLiteratureApp = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareQuote, setShareQuote] = useState(null);

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
  
  // リクエスト機能
  const { submitRequest, loading: requestLoading } = useQuoteRequest(user?.uid);

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
    setShowSearch(false);
    setShowRequest(false);
    setShowShare(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 検索画面の表示/非表示
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setShowRequest(false);
    setShowShare(false);
  };

  // 検索画面を閉じる
  const closeSearch = () => {
    setShowSearch(false);
  };

  // リクエスト画面の表示/非表示
  const toggleRequest = () => {
    setShowRequest(!showRequest);
    setShowSearch(false);
    setShowShare(false);
  };

  // リクエスト画面を閉じる
  const closeRequest = () => {
    setShowRequest(false);
  };

  // 共有画面の表示
  const handleShare = (quote) => {
    setShareQuote(quote);
    setShowShare(true);
    setShowSearch(false);
    setShowRequest(false);
  };

  // 共有画面を閉じる
  const closeShare = () => {
    setShowShare(false);
    setShareQuote(null);
  };

  // リクエスト送信
  const handleSubmitRequest = async (requestData) => {
    try {
      await submitRequest(requestData);
      console.log('リクエスト送信完了');
    } catch (error) {
      console.error('リクエスト送信失敗:', error);
      throw error;
    }
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
          onOpenSearch={toggleSearch}
          onOpenRequest={toggleRequest}
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
              <QuoteDisplay 
                quote={currentQuote}
                onShare={handleShare}
              />
              
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
          
          {/* フッターコンポーネントを使用 */}
          <Footer 
            showFavorites={showFavorites}
            favoritesCount={favorites.length}
          />
        </main>
      </div>

      {/* 検索オーバーレイ */}
      <QuoteSearch
        quotes={literatureQuotes}
        isVisible={showSearch}
        onClose={closeSearch}
        isFavorite={isFavorite}
        onToggleFavorite={handleFavoriteToggle}
        favoritesLoading={favoritesLoading}
      />

      {/* リクエストモーダル */}
      <QuoteRequest
        isOpen={showRequest}
        onClose={closeRequest}
        onSubmit={handleSubmitRequest}
      />

      {/* 共有モーダル */}
      <ShareQuote
        quote={shareQuote}
        isOpen={showShare}
        onClose={closeShare}
      />

      {/* PWAインストールプロンプト */}
      <InstallPrompt />
    </div>
  );
};

export default DailyLiteratureApp;