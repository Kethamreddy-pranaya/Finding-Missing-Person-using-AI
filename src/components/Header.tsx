import React from 'react';
import { Search, UserSearch } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserSearch size={32} />
          <h1 className="text-2xl font-bold">Missing Person Finder</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="#search" className="flex items-center space-x-1 hover:text-indigo-200">
            <Search size={20} />
            <span>Search</span>
          </a>
          <a href="#report" className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100">
            Report Missing Person
          </a>
        </nav>
      </div>
    </header>
  );
};