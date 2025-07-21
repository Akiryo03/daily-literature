// src/components/InstallPrompt.js
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS判定
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // スタンドアロンモード判定
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // PWAインストールイベントリスナー
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // インストール完了時
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWAインストール承認');
      } else {
        console.log('PWAインストール拒否');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // 24時間後に再表示
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // 既にインストール済みまたは24時間以内に却下された場合は表示しない
  if (isStandalone) return null;
  
  const dismissedTime = localStorage.getItem('installPromptDismissed');
  if (dismissedTime && (Date.now() - parseInt(dismissedTime)) < 24 * 60 * 60 * 1000) {
    return null;
  }

  // iOSの場合は手動インストール説明を表示
  if (isIOS && !isStandalone) {
    return (
      <div className="install-prompt ios-prompt">
        <div className="install-content">
          <div className="install-header">
            <Smartphone className="install-icon" />
            <span>アプリとして使用</span>
            <button onClick={handleDismiss} className="install-close">
              <X className="close-icon" />
            </button>
          </div>
          <p className="install-text">
            Safariの共有ボタン <span className="share-icon">⎋</span> から
            「ホーム画面に追加」でアプリのように使えます
          </p>
        </div>
      </div>
    );
  }

  // Android/PC用の自動インストールプロンプト
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="install-prompt">
        <div className="install-content">
          <div className="install-header">
            <Download className="install-icon" />
            <span>ホーム画面に追加</span>
            <button onClick={handleDismiss} className="install-close">
              <X className="close-icon" />
            </button>
          </div>
          <p className="install-text">
            アプリのようにホーム画面から簡単にアクセスできます
          </p>
          <div className="install-actions">
            <button onClick={handleInstallClick} className="install-button">
              インストール
            </button>
            <button onClick={handleDismiss} className="install-dismiss">
              後で
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;