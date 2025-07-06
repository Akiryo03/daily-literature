import React from 'react';
import {RefreshCw, BookOpen, Calendar } from 'lucide-react';

const Header = ({ currentDate, onRefresh }) => {
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
      <div className="refresh-section">
            <button
              onClick={onRefresh}
              className="refresh-button"
            >
              <RefreshCw className="refresh-icon" />
              別の名文を見る
            </button>
          </div>
    </header>
  );
};

export default Header;