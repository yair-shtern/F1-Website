import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({title, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <h1 class="py-8 text-4xl font-bold text-center">{title}</h1>
        <main className="flex-grow container mx-auto">
          {children}
        </main>
      <Footer />
    </div>
  );
};

export default Layout;
