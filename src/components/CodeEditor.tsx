import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { JavaInterpreter } from '../interpreter/core/JavaInterpreter';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`// IoT Sensor Example
int temperature = 25;
int humidity = 60;
boolean isActive = true;

System.out.println("IoT Sensor Starting...");
System.out.println("Initial temperature: " + temperature + "°C");
System.out.println("Initial humidity: " + humidity + "%");

// Simulate sensor readings
for (int i = 0; i < 5; i++) {
    temperature = temperature + (int)(Math.random() * 10) - 5;
    humidity = humidity + (int)(Math.random() * 6) - 3;
    
    System.out.println("Reading " + (i + 1) + ":");
    System.out.println("  Temperature: " + temperature + "°C");
    System.out.println("  Humidity: " + humidity + "%");
    
    if (temperature > 30) {
        System.out.println("  WARNING: High temperature detected!");
        isActive = false;
    }
    
    if (humidity < 40) {
        System.out.println("  WARNING: Low humidity detected!");
    }
}

if (isActive) {
    System.out.println("Sensor operating normally");
} else {
    System.out.println("Sensor shutdown due to high temperature");
}`);

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [interpreter] = useState(() => new JavaInterpreter());
  const [executionStats, setExecutionStats] = useState({
    executionTime: 0,
    gcPauseTime: 0,
    deadlineCompliance: 100,
    violations: 0,
    heapUsage: 0,
    allocatedObjects: 0
  });

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Starting JavaRT interpreter...\n');
    
    try {
      const startTime = performance.now();
      
      // Show compilation steps
      setOutput(prev => prev + 'Parsing Java source code...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Building Abstract Syntax Tree...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Initializing real-time GC...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Executing code...\n\n');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Actually interpret the code
      const result = interpreter.interpret(code);
      const executionTime = performance.now() - startTime;
      
      // Display the actual output
      setOutput(prev => prev + '=== Program Output ===\n');
      setOutput(prev => prev + result.output + '\n');
      
      // Calculate real statistics
      const gcMetrics = interpreter.getGCMetrics();
      const violations = interpreter.getDeadlineViolations();
      const heapStatus = interpreter.getHeapStatus();
      
      const avgGCPause = gcMetrics.length > 0 
        ? gcMetrics.reduce((sum, m) => sum + m.pauseTime, 0) / gcMetrics.length 
        : 0;
      
      setExecutionStats({
        executionTime: parseFloat(executionTime.toFixed(2)),
        gcPauseTime: parseFloat(avgGCPause.toFixed(2)),
        deadlineCompliance: violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 10),
        violations: violations.length,
        heapUsage: parseFloat(heapStatus.percentage.toFixed(1)),
        allocatedObjects: gcMetrics.length > 0 ? gcMetrics[gcMetrics.length - 1].allocatedObjects : 0
      });
      
      setOutput(prev => prev + '=== Execution Statistics ===\n');
      setOutput(prev => prev + `Total execution time: ${executionTime.toFixed(2)}ms\n`);
      setOutput(prev => prev + `Average GC pause: ${avgGCPause.toFixed(2)}ms\n`);
      setOutput(prev => prev + `Heap usage: ${heapStatus.percentage.toFixed(1)}%\n`);
      setOutput(prev => prev + `Objects allocated: ${heapStatus.used > 0 ? gcMetrics.length > 0 ? gcMetrics[gcMetrics.length - 1].allocatedObjects : 1 : 0}\n`);
      setOutput(prev => prev + `Deadline violations: ${violations.length}\n`);
      
      if (violations.length > 0) {
        setOutput(prev => prev + '\n=== Deadline Violations ===\n');
        violations.forEach(violation => {
          setOutput(prev => prev + `${violation}\n`);
        });
      }
      
    } catch (error) {
      setOutput(prev => prev + `\nExecution Error: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n[Execution stopped by user]\n');
  };

  const handleClear = () => {
    setOutput('');
    setExecutionStats({
      executionTime: 0,
      gcPauseTime: 0,
      deadlineCompliance: 100,
      violations: 0,
      heapUsage: 0,
      allocatedObjects: 0
    });
  };

  const handleTriggerGC = () => {
    interpreter.triggerGC();
    const heapStatus = interpreter.getHeapStatus();
    setOutput(prev => prev + `\n[Manual GC triggered - Heap: ${heapStatus.percentage.toFixed(1)}%]\n`);
    
    // Update stats
    const gcMetrics = interpreter.getGCMetrics();
    if (gcMetrics.length > 0) {
      const latest = gcMetrics[gcMetrics.length - 1];
      setExecutionStats(prev => ({
        ...prev,
        gcPauseTime: latest.pauseTime,
        heapUsage: latest.heapUsage
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Code Editor */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Java Code Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span className="text-sm">{isRunning ? 'Running' : 'Run'}</span>
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              <span className="text-sm">Stop</span>
            </button>
            <button
              onClick={handleTriggerGC}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">GC</span>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            spellCheck={false}
            placeholder="Enter your Java code here..."
          />
        </div>
        
        {/* Real-time Info */}
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-400">Real-time Java Interpreter</h3>
              <p className="text-xs text-gray-400 mt-1">
                Supports variables, loops, conditionals, method calls, and real garbage collection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Output Console */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Execution Output</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClear}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{isRunning ? 'Running' : 'Ready'}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto">
            {output || 'Ready to execute Java code...\n\nTry the sample IoT sensor code or write your own!'}
          </pre>
        </div>

        {/* Real Performance Stats */}
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{executionStats.gcPauseTime}ms</div>
              <div className="text-xs text-gray-400">GC Pause</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${executionStats.violations === 0 ? 'text-green-400' : 'text-red-400'}`}>
                {executionStats.heapUsage}%
              </div>
              <div className="text-xs text-gray-400">Heap Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{executionStats.allocatedObjects}</div>
              <div className="text-xs text-gray-400">Objects</div>
            </div>
          </div>
          
          {executionStats.violations > 0 && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{executionStats.violations} deadline violation{executionStats.violations !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;