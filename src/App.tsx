import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealTimeCodeEditor from './components/RealTimeCodeEditor';
import GCMonitor from './components/GCMonitor';
import TimeTravelDebugger from './components/TimeTravel';
import WasmDemo from './components/WasmDemo';
import Benchmarks from './components/Benchmarks';
import EmbeddedSimulator from './components/EmbeddedSimulator';
import TestRunner from './tests/TestRunner';
import HelpDocumentation from './components/HelpDocumentation';

type ActiveTab = 'editor' | 'gc' | 'debugger' | 'wasm' | 'benchmarks' | 'embedded' | 'tests' | 'help';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Listen for help navigation events
  useEffect(() => {
    const handleHelpNavigation = () => {
      setActiveTab('help');
    };

    window.addEventListener('navigate-to-help', handleHelpNavigation);
    return () => window.removeEventListener('navigate-to-help', handleHelpNavigation);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'editor':
        return <RealTimeCodeEditor />;
      case 'gc':
        return <GCMonitor />;
      case 'debugger':
        return <TimeTravelDebugger />;
      case 'wasm':
        return <WasmDemo />;
      case 'benchmarks':
        return <Benchmarks />;
      case 'embedded':
        return <EmbeddedSimulator />;
      case 'tests':
        return <TestRunner />;
      case 'help':
        return <HelpDocumentation />;
      default:
        return <RealTimeCodeEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;