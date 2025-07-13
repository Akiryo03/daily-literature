// src/components/FavoritesList.js (完全版)
import React, { useState } from 'react';
import { Trash2, BookOpen, Heart, Search, Calendar, User, ExternalLink } from 'lucide-react';
import QuoteDetailModal from './QuoteDetailModal';

const FavoritesList = ({ favorites, onRemove, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, author, era
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 検索とソートの処理
  const filteredAndSortedFavorites = React.useMemo(() => {
    let filtered = favorites.filter(favorite =>
      favorite.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (favorite.work && favorite.work.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'author':
          return a.author.localeCompare(b.author, 'ja');
        case 'era':
          return (a.era || '').localeCompare(b.era || '', 'ja');
        default:
          return 0;
      }
    });
  }, [favorites, searchTerm, sortBy]);

  // カードクリック時の詳細表示
  const handleCardClick = (favorite) => {
    setSelectedQuote(favorite);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <Heart className="loading-heart" />
        <p>お気に入りを読み込み中...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="no-favorites">
        <BookOpen className="no-favorites-icon" />
        <h2>まだお気に入りの名文がありません</h2>
        <p>気に入った名文を見つけたら、ハートボタンを押してお気に入りに追加しましょう</p>
        <div className="no-favorites-illustration">
          <Heart className="heart-1" />
          <Heart className="heart-2" />
          <Heart className="heart-3" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="favorites-list">
        {/* ヘッダー */}
        <div className="favorites-header">
          <h2 className="favorites-title">
            <Heart className="favorites-icon" />
            お気に入りの名文
            <span className="favorites-count-badge">{favorites.length}</span>
          </h2>
          
          {/* 検索とソート */}
          <div className="favorites-controls">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="名文、作者、作品名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="author">作者名順</option>
              <option value="era">時代順</option>
            </select>
          </div>

          {/* 使い方のヒント */}
          {favorites.length > 0 && (
            <div className="usage-hint">
              💡 カードをクリックすると詳細情報を表示できます
            </div>
          )}
        </div>

        {/* 検索結果が0件の場合 */}
        {filteredAndSortedFavorites.length === 0 && searchTerm && (
          <div className="no-search-results">
            <Search className="no-results-icon" />
            <p>「{searchTerm}」に一致するお気に入りが見つかりません</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search-button"
            >
              検索をクリア
            </button>
          </div>
        )}

        {/* お気に入り一覧 */}
        <div className="favorites-grid">
          {filteredAndSortedFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onRemove={onRemove}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* 詳細表示モーダル */}
      <QuoteDetailModal
        quote={selectedQuote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFromFavorites={true}
      />
    </>
  );
};

// 個別のお気に入りカードコンポーネント
const FavoriteCard = ({ favorite, onRemove, onClick }) => {
  const [showFullText, setShowFullText] = useState(false);
  const maxLength = 100;
  const shouldTruncate = favorite.text.length > maxLength;

  const handleRemove = (e) => {
    e.stopPropagation(); // カードクリックイベントの伝播を停止
    if (window.confirm(`「${favorite.author}」の名文をお気に入りから削除しますか？`)) {
      onRemove(favorite.id);
    }
  };

  const handleCardClick = () => {
    onClick(favorite);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation(); // カードクリックイベントの伝播を停止
    setShowFullText(!showFullText);
  };

  return (
    <div className="favorite-card" onClick={handleCardClick}>
      {/* クリックヒント */}
      <div className="card-click-hint">
        詳細を見る
      </div>

      {/* 名文 */}
      <blockquote className="favorite-quote">
        「{shouldTruncate && !showFullText 
          ? favorite.text.slice(0, maxLength) + '...' 
          : favorite.text}」
        
        {shouldTruncate && (
          <button
            onClick={handleExpandClick}
            className="expand-text-button"
          >
            {showFullText ? '短く表示' : 'すべて表示'}
          </button>
        )}
      </blockquote>
      
      {/* メタ情報 */}
      <div className="favorite-meta">
        <div className="favorite-author-info">
          <div className="author-line">
            <User className="meta-icon" />
            <span className="favorite-author">{favorite.author}</span>
          </div>
          
          {favorite.work && (
            <div className="work-line">
              <BookOpen className="meta-icon" />
              <span className="favorite-work">『{favorite.work}』</span>
            </div>
          )}
          
          {favorite.era && (
            <div className="era-line">
              <Calendar className="meta-icon" />
              <span className="favorite-era">{favorite.era}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleRemove}
          className="remove-favorite-button"
          title="お気に入りから削除"
        >
          <Trash2 className="trash-icon" />
        </button>
      </div>
      
      {/* 追加日 */}
      <div className="favorite-date">
        <Calendar className="date-icon" />
        追加日: {new Date(favorite.addedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};

export default FavoritesList;