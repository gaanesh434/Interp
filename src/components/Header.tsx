import React from 'react';
import { Activity, Github, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  const handleHelpClick = () => {
    // This will be handled by the parent component
    window.dispatchEvent(new CustomEvent('navigate-to-help'));
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JavaRT Interpreter</h1>
              <p className="text-sm text-gray-400">Real-time GC • Time-travel Debug • WebAssembly</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>GC: 0.3ms avg</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </button>
              
              <button 
                onClick={handleHelpClick}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help & Docs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;