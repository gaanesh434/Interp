import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Activity, Clock, TrendingDown, AlertCircle, Play, Pause, Trash2, Zap, Database } from 'lucide-react';
import { JavaInterpreter } from '../interpreter/core/JavaInterpreter';

interface GCData {
  time: string;
  pauseTime: number;
  heapUsage: number;
  offHeapUsage: number;
  collections: number;
  allocatedObjects: number;
  freedObjects: number;
  compactionTime: number;
}

const GCMonitor: React.FC = () => {
  const [gcData, setGcData] = useState<GCData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [interpreter] = useState(() => new JavaInterpreter());
  const [totalCollections, setTotalCollections] = useState(0);
  const [currentHeapUsage, setCurrentHeapUsage] = useState(0);
  const [currentOffHeapUsage, setCurrentOffHeapUsage] = useState(0);
  const [executionCount, setExecutionCount] = useState(0);

  // Real memory allocation test that generates actual GC activity
  const testCode = `// Real memory allocation test
String[] dataArray = new String[50];
int[] numberArray = new int[100];
int totalAllocations = 0;

System.out.println("Starting memory allocation test...");

for (int i = 0; i < 25; i++) {
    // Allocate string objects
    String largeString = "Data block " + i + " with content for testing";
    if (i < 50) {
        dataArray[i] = largeString;
    }
    
    // Create temporary objects that will become garbage
    for (int j = 0; j < 4; j++) {
        String tempData = "Temporary object " + i + "_" + j;
        int tempNumber = i * j + 10;
        if ((i * 4 + j) < 100) {
            numberArray[i * 4 + j] = tempNumber;
        }
    }
    
    totalAllocations = totalAllocations + 1;
    
    // Create large objects periodically
    if (i % 5 == 0) {
        String bigData = "";
        for (int k = 0; k < 10; k++) {
            bigData = bigData + "Large segment " + k + " ";
        }
        System.out.println("Created large object at iteration " + i);
    }
    
    if (i % 8 == 0) {
        System.out.println("Progress: " + i + " iterations, " + totalAllocations + " allocations");
    }
}

System.out.println("Memory test completed");
System.out.println("Total allocations: " + totalAllocations);`;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        try {
          // Execute the test code to generate real GC activity
          const result = interpreter.interpret(testCode);
          setExecutionCount(prev => prev + 1);
          
          // Get real metrics from interpreter
          const metrics = interpreter.getGCMetrics();
          const heapStatus = interpreter.getHeapStatus();
          
          if (metrics.length > 0) {
            const latestMetric = metrics[metrics.length - 1];
            
            // Create realistic data point based on actual execution
            const newData: GCData = {
              time: new Date().toLocaleTimeString(),
              pauseTime: parseFloat(latestMetric.pauseTime.toFixed(2)),
              heapUsage: parseFloat(latestMetric.heapUsage.toFixed(1)),
              offHeapUsage: parseFloat(latestMetric.offHeapUsage.toFixed(1)),
              collections: latestMetric.collections,
              allocatedObjects: latestMetric.allocatedObjects,
              freedObjects: latestMetric.freedObjects,
              compactionTime: parseFloat(latestMetric.compactionTime.toFixed(2)),
            };
            
            setGcData(prev => {
              const updated = [...prev, newData].slice(-20); // Keep last 20 data points
              return updated;
            });
            
            setTotalCollections(prev => prev + latestMetric.collections);
            setCurrentHeapUsage(latestMetric.heapUsage);
            setCurrentOffHeapUsage(latestMetric.offHeapUsage);
          }
        } catch (error) {
          console.error('GC monitoring error:', error);
        }
      }, 3000); // Execute every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, interpreter]);

  const avgPauseTime = gcData.length > 0 
    ? (gcData.reduce((sum, item) => sum + item.pauseTime, 0) / gcData.length).toFixed(2)
    : '0.00';

  const maxPauseTime = gcData.length > 0 
    ? Math.max(...gcData.map(item => item.pauseTime)).toFixed(2)
    : '0.00';

  const totalAllocated = gcData.length > 0 
    ? gcData[gcData.length - 1].allocatedObjects
    : 0;

  const totalFreed = gcData.length > 0 
    ? gcData[gcData.length - 1].freedObjects
    : 0;

  const avgCompactionTime = gcData.length > 0 
    ? (gcData.reduce((sum, item) => sum + item.compactionTime, 0) / gcData.length).toFixed(2)
    : '0.00';

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Reset data when starting monitoring
      setGcData([]);
      setTotalCollections(0);
      setCurrentHeapUsage(0);
      setCurrentOffHeapUsage(0);
      setExecutionCount(0);
    }
  };

  const handleManualGC = () => {
    // Execute test code first to create objects
    interpreter.interpret(testCode);
    
    // Then trigger GC
    interpreter.triggerGC();
    const metrics = interpreter.getGCMetrics();
    const heapStatus = interpreter.getHeapStatus();
    
    if (metrics.length > 0) {
      const latestMetric = metrics[metrics.length - 1];
      
      const newData: GCData = {
        time: new Date().toLocaleTimeString(),
        pauseTime: parseFloat(latestMetric.pauseTime.toFixed(2)),
        heapUsage: parseFloat(latestMetric.heapUsage.toFixed(1)),
        offHeapUsage: parseFloat(latestMetric.offHeapUsage.toFixed(1)),
        collections: 1,
        allocatedObjects: latestMetric.allocatedObjects,
        freedObjects: latestMetric.freedObjects,
        compactionTime: parseFloat(latestMetric.compactionTime.toFixed(2)),
      };
      
      setGcData(prev => [...prev, newData].slice(-20));
      setTotalCollections(prev => prev + 1);
      setCurrentHeapUsage(latestMetric.heapUsage);
      setCurrentOffHeapUsage(latestMetric.offHeapUsage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Real-time Garbage Collector Monitor</h1>
          <p className="text-gray-400">Live monitoring of JavaRT interpreter with actual code execution</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualGC}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Trigger GC</span>
          </button>
          
          <button
            onClick={handleToggleMonitoring}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      {isMonitoring && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-medium">Live Monitoring Active</span>
          </div>
          <div className="text-sm text-gray-300">
            Executing memory allocation tests every 3 seconds • Executions: {executionCount} • Data points: {gcData.length}
          </div>
        </div>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{avgPauseTime}ms</div>
              <div className="text-sm text-gray-400">Avg GC Pause</div>
              <div className="text-xs text-blue-400">Max: {maxPauseTime}ms</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <TrendingDown className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{currentHeapUsage.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Heap Usage</div>
              <div className="text-xs text-green-400">On-heap memory</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{currentOffHeapUsage.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Off-heap Usage</div>
              <div className="text-xs text-purple-400">ByteBuffer.direct</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold text-white">{totalAllocated}</div>
              <div className="text-sm text-gray-400">Objects Allocated</div>
              <div className="text-xs text-cyan-400">Live tracking</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white">{avgCompactionTime}ms</div>
              <div className="text-sm text-gray-400">Avg Compaction</div>
              <div className="text-xs text-yellow-400">Off-heap defrag</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Charts with Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GC Performance Metrics */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">GC Performance Metrics (Live Data)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gcData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="pauseTime" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="GC Pause (ms)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="compactionTime" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Compaction (ms)"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-400 mt-2">
            {isMonitoring ? `Live GC data from ${executionCount} code executions` : 'Start monitoring to see real GC metrics from code execution'}
          </div>
        </div>

        {/* Memory Usage Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Memory Usage Distribution (Real-time)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={gcData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="heapUsage" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
                name="Heap Usage (%)"
              />
              <Area 
                type="monotone" 
                dataKey="offHeapUsage" 
                stackId="2"
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Off-heap Usage (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-400 mt-2">
            Real-time heap vs off-heap memory from actual Java code execution
          </div>
        </div>
      </div>

      {/* Object Allocation Statistics */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Object Lifecycle Statistics (Live)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-green-400">{totalAllocated}</div>
            <div className="text-sm text-gray-400">Total Objects Allocated</div>
            <div className="text-xs text-green-400 mt-1">From {executionCount} executions</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-red-400">{totalFreed}</div>
            <div className="text-sm text-gray-400">Objects Freed by GC</div>
            <div className="text-xs text-red-400 mt-1">Garbage collected</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">{totalAllocated - totalFreed}</div>
            <div className="text-sm text-gray-400">Live Objects</div>
            <div className="text-xs text-blue-400 mt-1">Currently in memory</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-400">{totalCollections}</div>
            <div className="text-sm text-gray-400">GC Collections</div>
            <div className="text-xs text-purple-400 mt-1">Total runs</div>
          </div>
        </div>
      </div>

      {/* Real Code Being Executed */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Memory Allocation Test Code (Currently Executing)</h3>
        <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-64 overflow-y-auto">
          {testCode}
        </pre>
        <div className="text-sm text-gray-400 mt-2">
          This Java code executes every 3 seconds during monitoring, creating real objects and generating actual GC metrics.
        </div>
      </div>

      {/* GC Algorithm Details */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Real-time GC Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-md font-medium text-blue-400">Active Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real object allocation tracking from code execution</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mark and sweep with concurrent collection</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Off-heap allocation for large objects</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Automatic GC triggering based on heap pressure</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ByteBuffer.allocateDirect() for embedded systems</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium text-purple-400">Live Monitoring</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Sub-millisecond pause time measurement</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Real-time heap and off-heap usage tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Object lifecycle monitoring with reachability analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Off-heap defragmentation timing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Data from actual Java code execution</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCMonitor;