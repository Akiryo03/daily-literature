// src/components/AdSense.js
import React, { useEffect } from 'react';

// 広告コンポーネント
const AdSense = ({ 
  adClient, 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = '',
  adTest = 'off' // 'on' にするとテスト広告が表示される
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense Error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-adtest={adTest}
      />
    </div>
  );
};

// 特定の広告位置用のプリセットコンポーネント
export const HeaderAd = ({ adClient, adSlot }) => (
  <AdSense
    adClient={adClient}
    adSlot={adSlot}
    adFormat="horizontal"
    className="header-ad"
    style={{
      width: '100%',
      height: '90px',
      marginBottom: '1rem'
    }}
  />
);

export const SidebarAd = ({ adClient, adSlot }) => (
  <AdSense
    adClient={adClient}
    adSlot={adSlot}
    adFormat="vertical"
    className="sidebar-ad"
    style={{
      width: '300px',
      height: '600px'
    }}
  />
);

export const ContentAd = ({ adClient, adSlot }) => (
  <AdSense
    adClient={adClient}
    adSlot={adSlot}
    adFormat="rectangle"
    className="content-ad"
    style={{
      width: '100%',
      height: '280px',
      margin: '2rem 0'
    }}
  />
);

export const FooterAd = ({ adClient, adSlot }) => (
  <AdSense
    adClient={adClient}
    adSlot={adSlot}
    adFormat="horizontal"
    className="footer-ad"
    style={{
      width: '100%',
      height: '90px',
      marginTop: '1rem'
    }}
  />
);

export default AdSense;