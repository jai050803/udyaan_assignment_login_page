import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-root">
      <header className="top-header">
        <div className="header-content">
          <h1 className="header-title">Udyam Registration Portal</h1>
          <span className="msme-badge">MSME</span>
        </div>
      </header>
      <main className="main-container">
        {children}
      </main>
    </div>
  );
};
