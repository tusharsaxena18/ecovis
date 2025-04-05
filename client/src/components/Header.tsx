import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const Header: React.FC = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Default guest user for demonstration
  const guestUser = {
    username: 'Guest',
    fullName: 'Guest User',
    ecoScore: 50
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setLocation('/')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10a7 7 0 0114 0v4a7 7 0 01-14 0v-4z" />
              </svg>
              <span className="ml-2 text-xl font-bold font-heading text-neutral-800">EcoVis</span>
            </div>
          </div>
          <div className="flex items-center">
            {/* Notification bell */}
            <div className="flex-shrink-0">
              <div className="relative">
                <button
                  className="p-1 rounded-full text-neutral-600 hover:text-neutral-700 focus:outline-none"
                  onClick={() => {
                    toast({
                      title: "New notification",
                      description: "You have received eco tips for today.",
                    });
                  }}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
                </button>
              </div>
            </div>
            
            {/* User menu - always show demo profile */}
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex text-sm rounded-full focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                    <span className="text-primary-800 font-medium">GU</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{guestUser.fullName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/')}>
                    Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
