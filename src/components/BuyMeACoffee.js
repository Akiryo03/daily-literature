// src/components/BuyMeACoffee.js
import React, { useState } from 'react';
import { Coffee, Heart, Star, Gift, ExternalLink, X } from 'lucide-react';

// メインの支援ボタン
const BuyMeACoffeeButton = ({ username, message = "サポートする" }) => {
  const handleClick = () => {
    // Buy Me a Coffeeページを新しいタブで開く
    window.open(`https://www.buymeacoffee.com/${username}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button 
      onClick={handleClick}
      className="buymeacoffee-button"
    >
      <Coffee className="coffee-icon" />
      {message}
      <ExternalLink className="external-icon" />
    </button>
  );
};

// フッター内の控えめなサポートリンク
const FooterSupport = ({ username }) => {
  return (
    <div className="footer-support">
      <Coffee className="footer-support-icon" />
      <span>このアプリが気に入ったら </span>
      <a 
        href={`buymeacoffee.com/mainichimeibun`}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-support-link"
      >
        開発をサポート
        <ExternalLink className="footer-external-icon" />
      </a>
    </div>
  );
};

// サポート感謝メッセージ
const SupportAppreciation = () => {
  return (
    <div className="support-appreciation">
      <Heart className="appreciation-icon" />
      <h4>いつもご利用ありがとうございます</h4>
      <p>
        「まいにち名文」は皆様のサポートで運営されています。
        これからも素晴らしい名文をお届けできるよう努めてまいります。
      </p>
    </div>
  );
};

// 名前付きexportとdefault exportを明確に分離
export { FooterSupport, SupportAppreciation };
export default BuyMeACoffeeButton;