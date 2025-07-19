// src/components/ShareQuote.js
import React, { useState, useRef } from 'react';
import { X, Share2, Twitter, Facebook, Copy, Download, Camera, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

const ShareQuote = ({ quote, isOpen, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = useRef(null);

  // シェア用テキストを生成
  const getShareText = () => {
    const text = `「${quote.text}」\n\n${quote.author}`;
    const work = quote.work ? ` 『${quote.work}』より` : '';
    const era = quote.era ? ` (${quote.era})` : '';
    const hashtags = '\n\n#まいにち名文 #名言 #文学 #日本文学';
    
    return text + work + era + hashtags;
  };

  // URL共有用テキスト
  const getUrlShareText = () => {
    const baseText = getShareText();
    const url = '\n\nhttps://your-app-domain.com'; // 実際のドメインに変更
    return baseText + url;
  };

  // Twitter共有
  const shareToTwitter = () => {
    const text = encodeURIComponent(getUrlShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Facebook共有
  const shareToFacebook = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent('https://your-app-domain.com'); // 実際のドメインに変更
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  // クリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement('textarea');
      textArea.value = getShareText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Web Share API（モバイル対応）
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '素晴らしい名文を見つけました',
          text: getShareText(),
          url: 'https://daily-literature-3381e.web.app/' // 実際のドメインに変更
        });
      } catch (err) {
        console.error('共有に失敗しました:', err);
      }
    }
  };

  // 画像として保存
  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // 高解像度
        useCORS: true,
        allowTaint: true
      });
      
      // ダウンロード
      const link = document.createElement('a');
      link.download = `名文_${quote.author}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('画像生成に失敗しました:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ESCキーでモーダルを閉じる
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // モーダルが開いた時にbodyのスクロールを無効化
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen || !quote) return null;

  // スタイルオプション
  const styleOptions = [
    { id: 'classic', name: 'クラシック', bgColor: '#f8faff', textColor: '#374151' },
    { id: 'elegant', name: 'エレガント', bgColor: '#1f2937', textColor: '#f9fafb' },
    { id: 'warm', name: 'ウォーム', bgColor: '#fef7f7', textColor: '#7c2d12' },
    { id: 'nature', name: 'ナチュラル', bgColor: '#f0fdf4', textColor: '#14532d' }
  ];

  const currentStyle = styleOptions.find(style => style.id === selectedStyle);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="modal-header">
          <div className="modal-title">
            <Share2 className="modal-title-icon" />
            <span>名文を共有</span>
          </div>
          <button onClick={onClose} className="modal-close-button">
            <X className="close-icon" />
          </button>
        </div>

        {/* ボディ */}
        <div className="modal-body share-body">
          {/* スタイル選択 */}
          <div className="style-selector">
            <h4 className="style-title">カードスタイル</h4>
            <div className="style-options">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`style-option ${selectedStyle === style.id ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: style.bgColor, 
                    color: style.textColor,
                    border: selectedStyle === style.id ? '3px solid #4f46e5' : '2px solid #e5e7eb'
                  }}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* プレビューカード */}
          <div className="card-preview">
            <div 
              ref={cardRef}
              className="share-card"
              style={{ 
                backgroundColor: currentStyle.bgColor,
                color: currentStyle.textColor 
              }}
            >
              <div className="share-card-content">
                <blockquote className="share-quote-text">
                  「{quote.text}」
                </blockquote>
                
                <div className="share-quote-meta">
                  <div className="share-author">{quote.author}</div>
                  {quote.work && <div className="share-work">『{quote.work}』</div>}
                  {quote.era && <div className="share-era">{quote.era}</div>}
                </div>
                
                <div className="share-app-name">まいにち名文</div>
              </div>
            </div>
          </div>

          {/* 共有オプション */}
          <div className="share-options">
            <h4 className="share-title">共有方法を選択</h4>
            
            <div className="share-buttons">
              {/* ネイティブ共有（モバイル） */}
              {navigator.share && (
                <button onClick={handleNativeShare} className="share-button native">
                  <Share2 className="share-icon" />
                  共有
                </button>
              )}

              {/* Twitter */}
              <button onClick={shareToTwitter} className="share-button twitter">
                <Twitter className="share-icon" />
                Twitter
              </button>

              {/* Facebook */}
              <button onClick={shareToFacebook} className="share-button facebook">
                <Facebook className="share-icon" />
                Facebook
              </button>

              {/* コピー */}
              <button 
                onClick={copyToClipboard} 
                className={`share-button copy ${copySuccess ? 'success' : ''}`}
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="share-icon" />
                    コピー完了
                  </>
                ) : (
                  <>
                    <Copy className="share-icon" />
                    テキストコピー
                  </>
                )}
              </button>

              {/* 画像ダウンロード */}
              <button 
                onClick={downloadAsImage} 
                className="share-button download"
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? (
                  <>
                    <Camera className="share-icon animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Download className="share-icon" />
                    画像保存
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareQuote;