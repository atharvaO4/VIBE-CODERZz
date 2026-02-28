import React from 'react';
import Sidebar from './Sidebar';
import Toast from './Toast';

const Layout = ({ children }) => {
  return (
    <div id="app" style={{ display: 'block', minHeight: '100vh' }}>
      <div className="app-layout" style={{ display: 'flex' }}>
        
        {/* The Sidebar is injected here */}
        <Sidebar />

        {/* The Main Page Content goes here */}
        <main className="main-content" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
        
      </div>

      {/* The Toast container sits at the app level */}
      <Toast />
    </div>
  );
};

export default Layout;