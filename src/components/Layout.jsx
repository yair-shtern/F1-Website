import React from 'react';
import Header from './header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;