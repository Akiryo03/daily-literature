// src/components/Footer.js
import React from 'react';
import { Mail, Heart, BookOpen } from 'lucide-react';

const Footer = ({ showFavorites, favoritesCount }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* メインメッセージ */}
        <div className="footer-main-message">
          <BookOpen className="footer-icon" />
          <p>古くて新しい言葉たちに親しみましょう</p>
        </div>

        {/* お気に入り情報 */}
        {!showFavorites && favoritesCount > 0 && (
          <div className="footer-favorites-info">
            <Heart className="footer-heart-icon" />
            <span>お気に入り: {favoritesCount} 件</span>
          </div>
        )}

        {/* 区切り線 */}
        <div className="footer-divider"></div>

        {/* お問い合わせ情報 */}
        <div className="footer-contact">
          <Mail className="footer-contact-icon" />
          <p className="footer-contact-text">
            お問い合わせはこちらまでメールをお送りください:
          </p>
          <a 
            href="mailto:contact@mainichibun.com" 
            className="footer-email-link"
          >
            contact@mainichibun.com
          </a>
        </div>

        {/* アプリ情報 */}
        <div className="footer-app-info">
          <p className="footer-app-name">まいにち名文</p>
          <p className="footer-copyright">
            © 2025 まいにち名文. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;