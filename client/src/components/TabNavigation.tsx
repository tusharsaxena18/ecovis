import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/utils/auth';

interface TabNavigationProps {
  activeTab: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab }) => {
  const [, setLocation] = useLocation();
  
  // Get auth state, but handle case when auth context is not available
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.error('Error accessing auth context:', error);
  }

  // Public tabs shown to all users
  const publicTabs = [
    { id: 'waste-recognition', label: 'Waste Recognition', path: '/waste-recognition' }
  ];
  
  // Private tabs shown to authenticated users
  const privateTabs = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'emissions', label: 'CO₂ Emissions', path: '/emissions' },
    { id: 'forums', label: 'Forums', path: '/forums' },
    { id: 'marketplace', label: 'Marketplace', path: '/marketplace' },
    { id: 'profile', label: 'My Profile', path: '/profile' }
  ];
  
  // Show only public tabs when not authenticated
  const tabs = isAuthenticated ? [...publicTabs, ...privateTabs] : publicTabs;

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setLocation(tab.path)}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'tab-active text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              } whitespace-nowrap focus:outline-none`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
