// src/components/Header.js (リクエスト機能追加版)
import React from 'react';
import { RefreshCw, BookOpen, Calendar, Heart, Home, Search, Plus } from 'lucide-react';

const Header = ({ 
  currentDate, 
  onRefresh, 
  onToggleView, 
  showFavorites, 
  favoritesCount = 0,
  onOpenSearch,
  onOpenRequest 
}) => {
  return (
    <header className="header">
      <div className="header-title">
        <BookOpen className="header-icon" />
        <h1>まいにち名文</h1>
      </div>
      
      <div className="header-date">
        <Calendar className="date-icon" />
        <p>{currentDate}</p>
      </div>
      
      <p className="header-subtitle">人生を変える一文を。</p>
      
      {/* ナビゲーションボタン */}
      <div className="header-controls">
        <button
          onClick={onToggleView}
          className={`view-toggle-button ${showFavorites ? 'favorites-active' : ''}`}
        >
          {showFavorites ? (
            <>
              <Home className="control-icon" />
              今日の名文
            </>
          ) : (
            <>
              <Heart className="control-icon" />
              お気に入り
              {favoritesCount > 0 && (
                <span className="favorites-count">{favoritesCount}</span>
              )}
            </>
          )}
        </button>

        {/* 検索ボタン */}
        <button
          onClick={onOpenSearch}
          className="search-button"
        >
          <Search className="control-icon" />
          名文を検索
        </button>

        {/* 追加リクエストボタン */}
        <button
          onClick={onOpenRequest}
          className="request-button"
        >
          <Plus className="control-icon" />
          名文をリクエスト
        </button>
        
        {!showFavorites && (
          <button
            onClick={onRefresh}
            className="refresh-button-header"
          >
            <RefreshCw className="control-icon" />
            別の名文
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;