import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';

const Header = ({ currentDate }) => {
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
      <button className='header-reflesh-btn'>
        <span className="refresh-text">🔄新しい名文を見る</span>
         </button>
    </header>
  );
};

export default Header;