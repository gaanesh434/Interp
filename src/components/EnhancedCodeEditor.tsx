import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Clock, AlertTriangle, Trash2, Shield, Rewind, FastForward } from 'lucide-react';
import { JavaInterpreter } from '../interpreter/core/JavaInterpreter';

const EnhancedCodeEditor: React.FC = () => {
  const [code, setCode] = useState(`// Enhanced IoT Sensor with Real-time Constraints
@Deadline(ms=5)
int sensorRead() {
    int temperature = 25;
    int humidity = 60;
    boolean isActive = true;
    
    System.out.println("IoT Sensor Starting with Real-time Constraints...");
    
    // Real-time sensor loop with deadline enforcement
    for (int i = 0; i < 5; i++) {
        // Simulate sensor reading with safety checks
        temperature = temperature + Math.floor(Math.random() * 10) - 5;
        humidity = humidity + Math.floor(Math.random() * 6) - 3;
        
        System.out.println("Reading " + (i + 1) + ":");
        System.out.println("  Temperature: " + temperature + "°C");
        System.out.println("  Humidity: " + humidity + "%");
        
        // Safety-critical threshold checking
        if (temperature > 35) {
            System.out.println("  CRITICAL: Temperature exceeded safe limit!");
            isActive = false;
        }
        
        // Safe division with automatic verification
        int avgTemp = temperature / (i + 1); // Division by zero protection
        System.out.println("  Average temp: " + avgTemp + "°C");
        
        // Deadline-sensitive data transmission
        if (temperature > 30) {
            dataTransmit(temperature, humidity);
        }
    }
    
    return temperature;
}

@Deadline(ms=3)
void dataTransmit(int temp, int humidity) {
    System.out.println("Transmitting: T=" + temp + "°C, H=" + humidity + "%");
}`);

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [interpreter] = useState(() => new JavaInterpreter());
  const [executionStats, setExecutionStats] = useState({
    executionTime: 0,
    gcPauseTime: 0,
    deadlineCompliance: 100,
    safetyViolations: 0,
    deadlineViolations: 0,
    heapUsage: 0,
    offHeapUsage: 0,
    allocatedObjects: 0
  });

  const [timeTravelMode, setTimeTravelMode] = useState(false);
  const [currentSnapshot, setCurrentSnapshot] = useState<any>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Starting Enhanced JavaRT interpreter with safety verification...\n');
    
    try {
      const startTime = performance.now();
      
      setOutput(prev => prev + 'Parsing Java source with safety analysis...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Initializing real-time GC with off-heap optimization...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Enabling @Deadline enforcement and formal verification...\n');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setOutput(prev => prev + 'Executing with time-travel debugging enabled...\n\n');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Execute with enhanced interpreter
      const result = interpreter.interpret(code);
      const executionTime = performance.now() - startTime;
      
      // Display the actual output
      setOutput(prev => prev + '=== Program Output ===\n');
      setOutput(prev => prev + result.output + '\n');
      
      // Calculate enhanced statistics
      const gcMetrics = interpreter.getGCMetrics();
      const deadlineViolations = interpreter.getDeadlineViolations();
      const safetyViolations = interpreter.getSafetyViolations();
      const heapStatus = interpreter.getHeapStatus();
      const snapshots = interpreter.getTimeTravelSnapshots();
      
      const avgGCPause = gcMetrics.length > 0 
        ? gcMetrics.reduce((sum, m) => sum + m.pauseTime, 0) / gcMetrics.length 
        : 0;
      
      setExecutionStats({
        executionTime: parseFloat(executionTime.toFixed(2)),
        gcPauseTime: parseFloat(avgGCPause.toFixed(2)),
        deadlineCompliance: deadlineViolations.length === 0 ? 100 : Math.max(0, 100 - deadlineViolations.length * 20),
        safetyViolations: safetyViolations.length,
        deadlineViolations: deadlineViolations.length,
        heapUsage: parseFloat(heapStatus.percentage.toFixed(1)),
        offHeapUsage: parseFloat(heapStatus.offHeap.allocated / heapStatus.offHeap.total * 100),
        allocatedObjects: gcMetrics.length > 0 ? gcMetrics[gcMetrics.length - 1].allocatedObjects : 0
      });
      
      setOutput(prev => prev + '=== Enhanced Execution Statistics ===\n');
      setOutput(prev => prev + `Total execution time: ${executionTime.toFixed(2)}ms\n`);
      setOutput(prev => prev + `Average GC pause: ${avgGCPause.toFixed(2)}ms\n`);
      setOutput(prev => prev + `Heap usage: ${heapStatus.percentage.toFixed(1)}%\n`);
      setOutput(prev => prev + `Off-heap usage: ${(heapStatus.offHeap.allocated / heapStatus.offHeap.total * 100).toFixed(1)}%\n`);
      setOutput(prev => prev + `Safety violations: ${safetyViolations.length}\n`);
      setOutput(prev => prev + `Deadline violations: ${deadlineViolations.length}\n`);
      setOutput(prev => prev + `Time-travel snapshots: ${snapshots.length}\n`);
      
      if (deadlineViolations.length > 0) {
        setOutput(prev => prev + '\n=== Deadline Violations ===\n');
        deadlineViolations.forEach(violation => {
          setOutput(prev => prev + `${violation.methodName}: ${violation.actualMs.toFixed(2)}ms > ${violation.expectedMs}ms (${violation.severity})\n`);
        });
      }
      
      if (safetyViolations.length > 0) {
        setOutput(prev => prev + '\n=== Safety Violations ===\n');
        safetyViolations.forEach(violation => {
          setOutput(prev => prev + `Line ${violation.line}: ${violation.message} (${violation.severity})\n`);
        });
      }
      
    } catch (error) {
      setOutput(prev => prev + `\nExecution Error: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTimeTravelBack = () => {
    const snapshot = interpreter.stepBackInTime();
    if (snapshot) {
      setCurrentSnapshot(snapshot);
      setOutput(prev => prev + `\n[Time Travel] Stepped back to line ${snapshot.line}\n`);
    }
  };

  const handleTimeTravelForward = () => {
    const snapshot = interpreter.stepForwardInTime();
    if (snapshot) {
      setCurrentSnapshot(snapshot);
      setOutput(prev => prev + `\n[Time Travel] Stepped forward to line ${snapshot.line}\n`);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n[Execution stopped by user]\n');
  };

  const handleClear = () => {
    setOutput('');
    setCurrentSnapshot(null);
    setExecutionStats({
      executionTime: 0,
      gcPauseTime: 0,
      deadlineCompliance: 100,
      safetyViolations: 0,
      deadlineViolations: 0,
      heapUsage: 0,
      offHeapUsage: 0,
      allocatedObjects: 0
    });
  };

  const handleTriggerGC = () => {
    interpreter.triggerGC();
    const heapStatus = interpreter.getHeapStatus();
    setOutput(prev => prev + `\n[Manual GC triggered - Heap: ${heapStatus.percentage.toFixed(1)}%, Off-heap: ${(heapStatus.offHeap.allocated / heapStatus.offHeap.total * 100).toFixed(1)}%]\n`);
    
    const gcMetrics = interpreter.getGCMetrics();
    if (gcMetrics.length > 0) {
      const latest = gcMetrics[gcMetrics.length - 1];
      setExecutionStats(prev => ({
        ...prev,
        gcPauseTime: latest.pauseTime,
        heapUsage: latest.heapUsage,
        offHeapUsage: latest.offHeapUsage
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Enhanced Code Editor */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Enhanced Java Code Editor</h2>
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
            placeholder="Enter your Java code with @Deadline annotations..."
          />
        </div>
        
        {/* Enhanced Features Info */}
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className="text-green-400 font-medium">Safety Verification</div>
                <div className="text-gray-400">Division by zero, array bounds, null pointer protection</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <div className="text-blue-400 font-medium">@Deadline Enforcement</div>
                <div className="text-gray-400">Real-time constraint verification and violation detection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Output Console */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Enhanced Execution Output</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTimeTravelBack}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Rewind className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <button
              onClick={handleTimeTravelForward}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <FastForward className="w-4 h-4" />
              <span className="text-sm">Forward</span>
            </button>
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
            {output || 'Ready to execute enhanced Java code with real-time constraints...\n\nFeatures:\n• @Deadline annotations for real-time constraints\n• Formal verification for safety-critical operations\n• Time-travel debugging with circular buffer\n• Off-heap memory optimization\n• IoT safety enforcement'}
          </pre>
        </div>

        {/* Enhanced Performance Stats */}
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{executionStats.gcPauseTime}ms</div>
              <div className="text-xs text-gray-400">GC Pause</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${executionStats.safetyViolations === 0 ? 'text-green-400' : 'text-red-400'}`}>
                {executionStats.safetyViolations}
              </div>
              <div className="text-xs text-gray-400">Safety Issues</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${executionStats.deadlineViolations === 0 ? 'text-green-400' : 'text-red-400'}`}>
                {executionStats.deadlineViolations}
              </div>
              <div className="text-xs text-gray-400">Deadline Miss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{executionStats.offHeapUsage.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Off-heap</div>
            </div>
          </div>
          
          {(executionStats.safetyViolations > 0 || executionStats.deadlineViolations > 0) && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {executionStats.safetyViolations > 0 && `${executionStats.safetyViolations} safety violation${executionStats.safetyViolations !== 1 ? 's' : ''}`}
                {executionStats.safetyViolations > 0 && executionStats.deadlineViolations > 0 && ', '}
                {executionStats.deadlineViolations > 0 && `${executionStats.deadlineViolations} deadline miss${executionStats.deadlineViolations !== 1 ? 'es' : ''}`}
              </span>
            </div>
          )}
          
          {currentSnapshot && (
            <div className="mt-3 p-2 bg-indigo-900/20 border border-indigo-500 rounded text-sm">
              <div className="text-indigo-400 font-medium">Time Travel: Line {currentSnapshot.line}</div>
              <div className="text-gray-300 text-xs">Snapshot from {new Date(currentSnapshot.timestamp).toLocaleTimeString()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;