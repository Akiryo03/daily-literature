// src/hooks/useFavorites.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 名文のユニークIDを生成（作者名 + 名文の最初の20文字）
  const generateQuoteId = (quote) => {
    return `${quote.author}_${quote.text.slice(0, 20)}`.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龯]/g, '');
  };

  // お気に入り一覧を取得
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const docRef = doc(db, 'favorites', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFavorites(docSnap.data().quotes || []);
          console.log('お気に入り取得成功:', docSnap.data().quotes?.length || 0, '件');
        } else {
          // ドキュメントが存在しない場合は作成
          await setDoc(docRef, { quotes: [] });
          setFavorites([]);
          console.log('新しいお気に入りドキュメント作成');
        }
      } catch (error) {
        console.error('お気に入り取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  // お気に入りに追加
  // お気に入りに追加
  const addToFavorites = async (quote) => {
    if (!userId) {
      console.warn('ユーザーが認証されていません');
      return;
    }

    try {
      const docRef = doc(db, 'favorites', userId);
      const favoriteItem = {
        id: generateQuoteId(quote),
        text: quote.text,
        author: quote.author,
        work: quote.work || '',
        era: quote.era || '',
        source: quote.source || '',
        meaning: quote.meaning || '',
        // 詳細情報も保存
        authorInfo: quote.authorInfo || null,
        keywords: quote.keywords || null,
        examPoints: quote.examPoints || null,
        workInfo: quote.workInfo || null,
        addedAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        quotes: arrayUnion(favoriteItem)
      });

      setFavorites(prev => [...prev, favoriteItem]);
      console.log('お気に入りに追加:', favoriteItem.author);
    } catch (error) {
      console.error('お気に入り追加エラー:', error);
      // ドキュメントが存在しない場合の処理
      if (error.code === 'not-found') {
        try {
          const favoriteItem = {
            id: generateQuoteId(quote),
            text: quote.text,
            author: quote.author,
            work: quote.work || '',
            era: quote.era || '',
            source: quote.source || '',
            meaning: quote.meaning || '',
            // 詳細情報も保存
            authorInfo: quote.authorInfo || null,
            keywords: quote.keywords || null,
            examPoints: quote.examPoints || null,
            workInfo: quote.workInfo || null,
            addedAt: new Date().toISOString()
          };
          
          const docRef = doc(db, 'favorites', userId);
          await setDoc(docRef, { quotes: [favoriteItem] });
          setFavorites([favoriteItem]);
          console.log('新しいドキュメント作成してお気に入りに追加');
        } catch (createError) {
          console.error('ドキュメント作成エラー:', createError);
        }
      }
    }
  };

  // お気に入りから削除
  const removeFromFavorites = async (quoteId) => {
    if (!userId) {
      console.warn('ユーザーが認証されていません');
      return;
    }

    try {
      const docRef = doc(db, 'favorites', userId);
      const favoriteToRemove = favorites.find(fav => fav.id === quoteId);
      
      if (favoriteToRemove) {
        await updateDoc(docRef, {
          quotes: arrayRemove(favoriteToRemove)
        });

        setFavorites(prev => prev.filter(fav => fav.id !== quoteId));
        console.log('お気に入りから削除:', favoriteToRemove.author);
      }
    } catch (error) {
      console.error('お気に入り削除エラー:', error);
    }
  };

  // 名文がお気に入りに入っているかチェック
  const isFavorite = (quote) => {
    if (!quote) return false;
    const quoteId = generateQuoteId(quote);
    return favorites.some(fav => fav.id === quoteId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};