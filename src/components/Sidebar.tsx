import React from 'react';
import { 
  Code, 
  Activity, 
  RotateCcw, 
  Zap, 
  BarChart3, 
  Cpu,
  TestTube,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onToggle }) => {
  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: Code },
    { id: 'gc', label: 'GC Monitor', icon: Activity },
    { id: 'debugger', label: 'Time Travel', icon: RotateCcw },
    { id: 'wasm', label: 'WebAssembly', icon: Zap },
    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
    { id: 'embedded', label: 'IoT Simulator', icon: Cpu },
    { id: 'tests', label: 'Test Suite', icon: TestTube },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 transition-all duration-300 z-10 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-700 rounded-lg transition-colors mb-4"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{tab.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;