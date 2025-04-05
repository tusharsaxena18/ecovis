import React, { ReactNode, useState } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import Footer from '@/components/Footer';
import { useLocation } from 'wouter';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  
  // Determine active tab based on current route
  const getActiveTab = (): string => {
    switch (true) {
      case location === '/':
        return 'home';
      case location === '/waste-recognition':
        return 'waste-recognition';
      case location === '/emissions':
        return 'emissions';
      case location === '/forums':
        return 'forums';
      case location === '/marketplace':
        return 'marketplace';
      case location === '/profile':
        return 'profile';
      default:
        return 'home';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TabNavigation activeTab={getActiveTab()} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
