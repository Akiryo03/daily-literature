// src/components/FavoriteButton.js
import React from 'react';
import { Heart } from 'lucide-react';

const FavoriteButton = ({ quote, isFavorite, onToggle, loading = false }) => {
  const handleClick = () => {
    if (loading) return;
    onToggle(quote);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`favorite-button ${isFavorite ? 'favorited' : ''} ${loading ? 'loading' : ''}`}
      title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <Heart 
        className={`heart-icon ${isFavorite ? 'filled' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
      {loading ? '処理中...' : (isFavorite ? 'お気に入り済み' : 'お気に入りに追加')}
    </button>
  );
};

export default FavoriteButton;