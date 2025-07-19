// src/components/QuoteSearch.js
import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter, BookOpen, User, Calendar, Lightbulb, Heart } from 'lucide-react';
import QuoteDetailModal from './QuoteDetailModal';
import FavoriteButton from './FavoriteButton';

const QuoteSearch = ({ 
  quotes, 
  onClose, 
  isVisible,
  isFavorite,
  onToggleFavorite,
  favoritesLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 時代一覧を取得
  const eras = useMemo(() => {
    const eraSet = new Set(quotes.map(quote => quote.era).filter(Boolean));
    return ['all', ...Array.from(eraSet).sort()];
  }, [quotes]);

  // 検索とフィルタリング
  const filteredQuotes = useMemo(() => {
    let filtered = quotes;

    // テキスト検索
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(quote =>
        quote.text.toLowerCase().includes(searchLower) ||
        quote.author.toLowerCase().includes(searchLower) ||
        (quote.work && quote.work.toLowerCase().includes(searchLower)) ||
        (quote.meaning && quote.meaning.toLowerCase().includes(searchLower)) ||
        (quote.keywords && quote.keywords.some(keyword => 
          keyword.word.toLowerCase().includes(searchLower) ||
          keyword.meaning.toLowerCase().includes(searchLower)
        ))
      );
    }

    // 時代フィルタ
    if (selectedEra !== 'all') {
      filtered = filtered.filter(quote => quote.era === selectedEra);
    }

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.author.localeCompare(b.author, 'ja');
        case 'era':
          return (a.era || '').localeCompare(b.era || '', 'ja');
        case 'length':
          return a.text.length - b.text.length;
        case 'relevance':
        default:
          // 検索語句との関連度でソート
          if (!searchTerm.trim()) return 0;
          const aRelevance = calculateRelevance(a, searchTerm);
          const bRelevance = calculateRelevance(b, searchTerm);
          return bRelevance - aRelevance;
      }
    });

    return filtered;
  }, [quotes, searchTerm, selectedEra, sortBy]);

  // 関連度計算
  const calculateRelevance = (quote, term) => {
    const termLower = term.toLowerCase();
    let score = 0;
    
    // 作者名での一致
    if (quote.author.toLowerCase().includes(termLower)) score += 10;
    
    // 名文での一致
    const textMatches = (quote.text.toLowerCase().match(new RegExp(termLower, 'g')) || []).length;
    score += textMatches * 5;
    
    // 作品名での一致
    if (quote.work && quote.work.toLowerCase().includes(termLower)) score += 8;
    
    // キーワードでの一致
    if (quote.keywords) {
      quote.keywords.forEach(keyword => {
        if (keyword.word.toLowerCase().includes(termLower)) score += 6;
        if (keyword.meaning.toLowerCase().includes(termLower)) score += 3;
      });
    }
    
    return score;
  };

  // 検索をクリア
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedEra('all');
    setSortBy('relevance');
  };

  // カードクリック時の詳細表示
  const handleCardClick = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  // ESCキーで検索画面を閉じる
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      <div className="search-overlay">
        <div className="search-container">
          {/* 検索ヘッダー */}
          <div className="search-header">
            <div className="search-title">
              <Search className="search-title-icon" />
              <h2>名文を検索</h2>
            </div>
            <button onClick={onClose} className="search-close-button">
              <X className="close-icon" />
            </button>
          </div>

          {/* 検索コントロール */}
          <div className="search-controls">
            <div className="search-input-container">
              <Search className="search-input-icon" />
              <input
                type="text"
                placeholder="　　作者名、名文、作品名、キーワードで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-main-input"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="search-clear-button"
                >
                  <X className="clear-icon" />
                </button>
              )}
            </div>

            <div className="search-controls-right">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
              >
                <Filter className="filter-icon" />
                <span className="filter-text">フィルタ</span>
              </button>
            </div>
          </div>

          {/* フィルタ */}
          {showFilters && (
            <div className="search-filters">
              <div className="filter-group">
                <label className="filter-label">時代</label>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">すべての時代</option>
                  {eras.slice(1).map(era => (
                    <option key={era} value={era}>{era}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">並び順</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="relevance">関連度順</option>
                  <option value="author">作者名順</option>
                  <option value="era">時代順</option>
                  <option value="length">文章の長さ順</option>
                </select>
              </div>

              <button onClick={clearSearch} className="clear-filters-button">
                すべてクリア
              </button>
            </div>
          )}

          {/* 検索結果 */}
          <div className="search-results">
            <div className="search-results-header">
              <span className="results-count">
                {filteredQuotes.length} 件の名文が見つかりました
              </span>
              {searchTerm && (
                <span className="search-query">
                  「{searchTerm}」の検索結果
                </span>
              )}
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="no-search-results">
                <Search className="no-results-icon" />
                <h3>検索結果が見つかりません</h3>
                <p>検索条件を変更してもう一度お試しください</p>
                <button onClick={clearSearch} className="try-again-button">
                  検索をクリア
                </button>
              </div>
            ) : (
              <div className="search-results-grid">
                {filteredQuotes.map((quote, index) => (
                  <SearchResultCard
                    key={`${quote.author}-${index}`}
                    quote={quote}
                    searchTerm={searchTerm}
                    onClick={handleCardClick}
                    isFavorite={isFavorite(quote)}
                    onToggleFavorite={onToggleFavorite}
                    favoritesLoading={favoritesLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 詳細表示モーダル */}
      <QuoteDetailModal
        quote={selectedQuote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFromFavorites={false}
      />
    </>
  );
};

// 検索結果カードコンポーネント
const SearchResultCard = ({ 
  quote, 
  searchTerm, 
  onClick, 
  isFavorite, 
  onToggleFavorite, 
  favoritesLoading 
}) => {
  const highlightText = (text, term) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(quote);
  };

  return (
    <div className="search-result-card" onClick={() => onClick(quote)}>
      <div className="search-card-header">
        <div className="search-card-meta">
          <span className="search-card-author">
            {highlightText(quote.author, searchTerm)}
          </span>
          {quote.era && (
            <span className="search-card-era">
              {highlightText(quote.era, searchTerm)}
            </span>
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          className={`search-favorite-button ${isFavorite ? 'favorited' : ''}`}
          disabled={favoritesLoading}
        >
          <Heart 
            className="search-heart-icon"
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <blockquote className="search-card-quote">
        「{highlightText(quote.text, searchTerm)}」
      </blockquote>

      {quote.work && (
        <div className="search-card-work">
          <BookOpen className="work-icon" />
          {highlightText(quote.work, searchTerm)}
        </div>
      )}

      {quote.meaning && (
        <div className="search-card-meaning">
          <Lightbulb className="meaning-icon" />
          <span className="meaning-text">
            {highlightText(quote.meaning.slice(0, 100), searchTerm)}
            {quote.meaning.length > 100 && '...'}
          </span>
        </div>
      )}

      <div className="search-card-hint">
        クリックで詳細を表示
      </div>
    </div>
  );
};

export default QuoteSearch;