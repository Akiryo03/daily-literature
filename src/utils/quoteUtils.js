// src/utils/quoteUtils.js
import { generateLiteratureQuotes } from '../data/literatureData';

// 名文IDから完全なデータを取得する関数
export const getCompleteQuoteData = (favoriteQuote) => {
  const allQuotes = generateLiteratureQuotes();
  
  // 作者名と名文の一部で一致する項目を検索
  const matchingQuote = allQuotes.find(quote => 
    quote.author === favoriteQuote.author && 
    quote.text === favoriteQuote.text
  );

  if (matchingQuote) {
    // 完全なデータが見つかった場合、お気に入り情報とマージ
    return {
      ...matchingQuote,
      addedAt: favoriteQuote.addedAt, // お気に入り追加日は保持
      id: favoriteQuote.id // お気に入りIDは保持
    };
  }

  // 見つからない場合は、お気に入りデータをそのまま返す
  // （デフォルトの詳細情報を追加）
  return {
    ...favoriteQuote,
    authorInfo: favoriteQuote.authorInfo || {
      lifespan: '詳細不明',
      period: '詳細不明',
      background: 'この作者についての詳細情報は現在準備中です。',
      majorWorks: ['詳細情報準備中'],
      literaryStyle: '詳細情報準備中'
    },
    keywords: favoriteQuote.keywords || [
      { 
        word: '文学的表現', 
        meaning: 'この名文に含まれる特徴的な表現技法や文学的な工夫' 
      },
      { 
        word: '時代背景', 
        meaning: 'この名文が生まれた歴史的・文化的な背景' 
      }
    ],
    examPoints: favoriteQuote.examPoints || [
      'この名文の文学史上の意義を理解する',
      '作者の他の作品との関連性を把握する',
      '時代背景と作品の関係性を考察する'
    ],
    meaning: favoriteQuote.meaning || 'この名文についての詳細な解説は準備中です。',
    workInfo: favoriteQuote.workInfo || {
      publishYear: '詳細不明',
      genre: '文学作品',
      background: '作品についての詳細情報は準備中です。'
    }
  };
};

// 複数のお気に入りから完全なデータを取得
export const getCompleteQuotesData = (favoriteQuotes) => {
  return favoriteQuotes.map(favorite => getCompleteQuoteData(favorite));
};