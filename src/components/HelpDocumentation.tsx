import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Play, 
  Zap, 
  Activity, 
  RotateCcw, 
  Cpu, 
  TestTube,
  Copy,
  CheckCircle,
  Clock,
  Shield,
  Database
} from 'lucide-react';

const HelpDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: Book },
    { id: 'editor', title: 'Code Editor', icon: Code },
    { id: 'gc', title: 'GC Monitor', icon: Activity },
    { id: 'debugger', title: 'Time Travel', icon: RotateCcw },
    { id: 'wasm', title: 'WebAssembly', icon: Zap },
    { id: 'iot', title: 'IoT Simulator', icon: Cpu },
    { id: 'tests', title: 'Test Suite', icon: TestTube },
    { id: 'examples', title: 'Code Examples', icon: Play },
  ];

  const iotExamples = [
    {
      id: 'basic-sensor',
      title: 'Basic IoT Sensor Reading',
      description: 'Simple temperature and humidity sensor with safety checks',
      code: `@Deadline(ms=5)
public void basicSensorRead() {
    int temperature = 25;
    int humidity = 60;
    boolean isActive = true;
    
    System.out.println("Basic IoT Sensor Starting...");
    
    for (int i = 0; i < 3; i++) {
        // Simulate sensor reading
        temperature = temperature + Math.floor(Math.random() * 6) - 3;
        humidity = humidity + Math.floor(Math.random() * 4) - 2;
        
        System.out.println("Reading " + (i + 1) + ":");
        System.out.println("  Temperature: " + temperature + "°C");
        System.out.println("  Humidity: " + humidity + "%");
        
        // Safety checks
        if (temperature > 30) {
            System.out.println("  WARNING: High temperature!");
            isActive = false;
        }
        
        if (humidity < 40) {
            System.out.println("  WARNING: Low humidity!");
        }
    }
    
    System.out.println("Sensor status: " + (isActive ? "ACTIVE" : "ALERT"));
}`
    },
    {
      id: 'multi-sensor',
      title: 'Multi-Sensor Data Processing',
      description: 'Processing data from multiple sensors with averaging',
      code: `@Deadline(ms=10)
public void multiSensorProcessing() {
    int[] temperatureReadings = new int[5];
    int[] humidityReadings = new int[5];
    int totalTemp = 0;
    int totalHumidity = 0;
    
    System.out.println("Multi-Sensor Processing Started");
    
    // Collect readings from multiple sensors
    for (int i = 0; i < 5; i++) {
        temperatureReadings[i] = 20 + Math.floor(Math.random() * 15);
        humidityReadings[i] = 40 + Math.floor(Math.random() * 30);
        
        totalTemp = totalTemp + temperatureReadings[i];
        totalHumidity = totalHumidity + humidityReadings[i];
        
        System.out.println("Sensor " + (i + 1) + ": T=" + temperatureReadings[i] + "°C, H=" + humidityReadings[i] + "%");
    }
    
    // Calculate averages
    int avgTemp = totalTemp / 5;
    int avgHumidity = totalHumidity / 5;
    
    System.out.println("Average Temperature: " + avgTemp + "°C");
    System.out.println("Average Humidity: " + avgHumidity + "%");
    
    // Environmental assessment
    if (avgTemp > 25 && avgHumidity > 60) {
        System.out.println("Environment: OPTIMAL");
    } else {
        System.out.println("Environment: SUBOPTIMAL");
    }
}`
    },
    {
      id: 'safety-critical',
      title: 'Safety-Critical System',
      description: 'Industrial sensor with safety protocols and emergency shutdown',
      code: `@Deadline(ms=3)
@SafetyCheck
public void safetyCriticalSystem() {
    int pressure = 100;
    int temperature = 25;
    boolean emergencyShutdown = false;
    int alertLevel = 0;
    
    System.out.println("Safety-Critical System Online");
    System.out.println("Monitoring pressure and temperature...");
    
    for (int i = 0; i < 4; i++) {
        // Simulate industrial sensor readings
        pressure = pressure + Math.floor(Math.random() * 20) - 10;
        temperature = temperature + Math.floor(Math.random() * 8) - 4;
        
        System.out.println("Cycle " + (i + 1) + ":");
        System.out.println("  Pressure: " + pressure + " PSI");
        System.out.println("  Temperature: " + temperature + "°C");
        
        // Critical safety checks
        if (pressure > 120) {
            alertLevel = 3;
            System.out.println("  CRITICAL: Pressure exceeds safe limit!");
            emergencyShutdown = true;
        } else if (pressure > 110) {
            alertLevel = 2;
            System.out.println("  WARNING: Pressure approaching limit");
        }
        
        if (temperature > 40) {
            alertLevel = Math.max(alertLevel, 2);
            System.out.println("  WARNING: High temperature detected");
        }
        
        // Emergency protocols
        if (emergencyShutdown) {
            System.out.println("  EMERGENCY SHUTDOWN INITIATED");
            break;
        }
    }
    
    System.out.println("Final Status:");
    System.out.println("  Alert Level: " + alertLevel);
    System.out.println("  System: " + (emergencyShutdown ? "SHUTDOWN" : "OPERATIONAL"));
}`
    },
    {
      id: 'data-transmission',
      title: 'IoT Data Transmission',
      description: 'Sensor data collection with network transmission simulation',
      code: `@Deadline(ms=8)
public void dataTransmissionSystem() {
    String[] dataBuffer = new String[10];
    int bufferIndex = 0;
    int transmissionCount = 0;
    boolean networkAvailable = true;
    
    System.out.println("IoT Data Transmission System");
    System.out.println("Collecting and transmitting sensor data...");
    
    for (int i = 0; i < 6; i++) {
        // Generate sensor data
        int sensorValue = 50 + Math.floor(Math.random() * 100);
        String timestamp = "T" + i;
        String dataPacket = timestamp + ":" + sensorValue;
        
        // Store in buffer
        dataBuffer[bufferIndex] = dataPacket;
        bufferIndex = (bufferIndex + 1) % 10;
        
        System.out.println("Data collected: " + dataPacket);
        
        // Transmit every 2 readings
        if (i % 2 == 1 && networkAvailable) {
            System.out.println("Transmitting data batch...");
            for (int j = 0; j < 2; j++) {
                int index = (bufferIndex - 2 + j + 10) % 10;
                if (dataBuffer[index] != null) {
                    System.out.println("  Sent: " + dataBuffer[index]);
                    transmissionCount++;
                }
            }
        }
        
        // Simulate network issues
        if (Math.random() < 0.2) {
            networkAvailable = false;
            System.out.println("  Network unavailable - buffering data");
        } else {
            networkAvailable = true;
        }
    }
    
    System.out.println("Transmission Summary:");
    System.out.println("  Total transmissions: " + transmissionCount);
    System.out.println("  Network status: " + (networkAvailable ? "ONLINE" : "OFFLINE"));
}`
    },
    {
      id: 'real-time-control',
      title: 'Real-Time Control System',
      description: 'Actuator control with feedback loop and timing constraints',
      code: `@Deadline(ms=2)
@RealTime
public void realTimeControlSystem() {
    int setpoint = 50;
    int currentValue = 45;
    int actuatorOutput = 0;
    int error = 0;
    
    System.out.println("Real-Time Control System Active");
    System.out.println("Setpoint: " + setpoint);
    
    for (int i = 0; i < 5; i++) {
        // Calculate control error
        error = setpoint - currentValue;
        
        // Simple proportional control
        actuatorOutput = error * 2;
        
        // Apply actuator limits
        if (actuatorOutput > 20) {
            actuatorOutput = 20;
        } else if (actuatorOutput < -20) {
            actuatorOutput = -20;
        }
        
        // Simulate system response
        currentValue = currentValue + (actuatorOutput / 4);
        
        System.out.println("Control Cycle " + (i + 1) + ":");
        System.out.println("  Current: " + currentValue);
        System.out.println("  Error: " + error);
        System.out.println("  Output: " + actuatorOutput);
        
        // Check if within tolerance
        if (Math.abs(error) < 2) {
            System.out.println("  Status: IN TOLERANCE");
        } else {
            System.out.println("  Status: ADJUSTING");
        }
    }
    
    System.out.println("Control loop completed");
    System.out.println("Final error: " + Math.abs(error));
}`
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">JavaRT Interpreter Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                JavaRT is a revolutionary Java interpreter designed for embedded systems and real-time applications. 
                It features sub-millisecond garbage collection, time-travel debugging, and WebAssembly compilation 
                for browser execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Real-time Performance</h3>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Sub-millisecond GC pause times (0.5ms avg)</li>
                  <li>• @Deadline annotations for timing constraints</li>
                  <li>• Real-time safety verification</li>
                  <li>• Embedded system optimization</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Safety Features</h3>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Division by zero detection</li>
                  <li>• Array bounds checking</li>
                  <li>• Null pointer protection</li>
                  <li>• IoT safety constraints</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Database className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Memory Management</h3>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Off-heap allocation for large objects</li>
                  <li>• Concurrent mark and sweep GC</li>
                  <li>• Memory compaction</li>
                  <li>• Real-time heap monitoring</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Advanced Features</h3>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Time-travel debugging</li>
                  <li>• WebAssembly compilation</li>
                  <li>• IoT platform support</li>
                  <li>• Live syntax highlighting</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'editor':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Code Editor Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Syntax Highlighting</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Java keywords in blue</li>
                    <li>• IoT annotations (@Deadline, @Sensor) in purple</li>
                    <li>• Strings in green</li>
                    <li>• Numbers in yellow</li>
                    <li>• Comments in gray italic</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Error Detection</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Real-time syntax validation</li>
                    <li>• Division by zero detection</li>
                    <li>• Missing semicolon warnings</li>
                    <li>• Invalid @Deadline syntax</li>
                    <li>• Unsafe operation detection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Writing Code</h4>
                  <p className="text-sm">Type Java code in the editor. Syntax highlighting will appear automatically.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. IoT Annotations</h4>
                  <p className="text-sm">Use @Deadline(ms=value) for real-time constraints, @Sensor for sensor data, @SafetyCheck for critical operations.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. Running Code</h4>
                  <p className="text-sm">Click "Run" to execute. The interpreter will show real-time metrics including GC performance and deadline compliance.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Auto-completion</h4>
                  <p className="text-sm">Press Ctrl+Space for intelligent code completion with IoT-specific suggestions.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gc':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">GC Monitor Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Real-time Garbage Collection</h3>
              <p className="text-gray-300 mb-4">
                The GC Monitor shows live metrics from actual Java code execution, including heap usage, 
                pause times, and object allocation patterns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Key Metrics</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• GC pause time (target: &lt;1ms)</li>
                    <li>• Heap usage percentage</li>
                    <li>• Off-heap allocation</li>
                    <li>• Objects allocated/freed</li>
                    <li>• Compaction time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Features</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Live monitoring during code execution</li>
                    <li>• Manual GC triggering</li>
                    <li>• Real-time charts</li>
                    <li>• Memory allocation tracking</li>
                    <li>• Off-heap optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Start Monitoring</h4>
                  <p className="text-sm">Click "Start Monitoring" to begin executing memory allocation tests every 3 seconds.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. View Live Data</h4>
                  <p className="text-sm">Watch real-time charts showing GC performance, heap usage, and object lifecycle.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. Manual GC</h4>
                  <p className="text-sm">Click "Trigger GC" to manually force garbage collection and see immediate metrics.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Analyze Performance</h4>
                  <p className="text-sm">Monitor pause times, memory usage patterns, and off-heap allocation efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'debugger':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Time-travel Debugger Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Time-travel Debugging</h3>
              <p className="text-gray-300 mb-4">
                Step backwards and forwards through execution history, inspect variable states at any point, 
                and set checkpoints for quick navigation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Capabilities</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Step back/forward through execution</li>
                    <li>• Variable state inspection</li>
                    <li>• Execution timeline</li>
                    <li>• Checkpoint creation</li>
                    <li>• Call stack visualization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Controls</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• ⏮️ Go to first state</li>
                    <li>• ⏪ Step backward</li>
                    <li>• ▶️ Replay execution</li>
                    <li>• ⏩ Step forward</li>
                    <li>• ⏭️ Go to last state</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Start Recording</h4>
                  <p className="text-sm">Click "Start Recording" to execute debug code and capture execution states.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. Navigate States</h4>
                  <p className="text-sm">Use the control buttons to step through execution history and inspect variables.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. Set Checkpoints</h4>
                  <p className="text-sm">Click "Checkpoint" to mark important states for quick navigation.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Analyze Execution</h4>
                  <p className="text-sm">View variable values, call stack, and program output at each execution point.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wasm':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">WebAssembly Compilation Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Java to WebAssembly</h3>
              <p className="text-gray-300 mb-4">
                Compile Java code to WebAssembly for high-performance browser execution with real code generation 
                and JavaScript bridge integration.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Features</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Real WASM code generation</li>
                    <li>• JavaScript bridge creation</li>
                    <li>• Memory management</li>
                    <li>• Function exports</li>
                    <li>• Performance benchmarking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Use Cases</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Edge computing</li>
                    <li>• Scientific computing</li>
                    <li>• Game development</li>
                    <li>• IoT dashboards</li>
                    <li>• High-performance web apps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Compile to WASM</h4>
                  <p className="text-sm">Click "Compile to WASM" to generate WebAssembly code from Java source.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. View Generated Code</h4>
                  <p className="text-sm">Inspect the generated WASM text format and JavaScript bridge code.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. Copy Code</h4>
                  <p className="text-sm">Use the copy buttons to get production-ready WASM and JavaScript code.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Run Benchmarks</h4>
                  <p className="text-sm">Compare performance against JavaScript and native Java execution.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'iot':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">IoT Simulator Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Embedded Systems Simulation</h3>
              <p className="text-gray-300 mb-4">
                Real IoT sensor simulation using actual Java code execution with live data from interpreter variables 
                and system metrics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Real Data Sources</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Temperature from interpreter variables</li>
                    <li>• Humidity from code execution</li>
                    <li>• Pressure calculated from sensors</li>
                    <li>• CPU usage from GC activity</li>
                    <li>• Memory from heap status</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Supported Platforms</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Raspberry Pi 4</li>
                    <li>• Arduino ESP32</li>
                    <li>• BeagleBone Black</li>
                    <li>• Jetson Nano</li>
                    <li>• Custom embedded systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Start Simulation</h4>
                  <p className="text-sm">Click "Start Simulation" to begin executing real IoT sensor code every 4 seconds.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. Monitor Live Data</h4>
                  <p className="text-sm">Watch real sensor readings extracted from actual Java variable values.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. View System Metrics</h4>
                  <p className="text-sm">Monitor CPU, memory, GC latency, and deadline violations from real execution.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Analyze Performance</h4>
                  <p className="text-sm">Use the charts to track environmental data and system resource usage over time.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tests':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Test Suite Documentation</h2>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Comprehensive Testing</h3>
              <p className="text-gray-300 mb-4">
                Automated test suite that validates syntax highlighting, error detection, code execution, 
                GC metrics, and IoT functionality.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Test Categories</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Syntax highlighting validation</li>
                    <li>• Error detection testing</li>
                    <li>• Code execution verification</li>
                    <li>• GC metrics validation</li>
                    <li>• Deadline enforcement testing</li>
                    <li>• IoT scenario testing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Validation</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Real interpreter execution</li>
                    <li>• Actual GC metrics</li>
                    <li>• Variable evaluation</li>
                    <li>• Output verification</li>
                    <li>• Performance measurement</li>
                    <li>• Safety checking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Run All Tests</h4>
                  <p className="text-sm">Click "Run All Tests" to execute the complete test suite with live output.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. Monitor Progress</h4>
                  <p className="text-sm">Watch real-time test execution with detailed output and progress indicators.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. Review Results</h4>
                  <p className="text-sm">Check test results, pass/fail status, and detailed error information.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">4. Validate Components</h4>
                  <p className="text-sm">Ensure all JavaRT components are working correctly with real data validation.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">IoT Code Examples</h2>
            <p className="text-gray-300">
              Ready-to-use IoT code examples that demonstrate real-time constraints, sensor processing, 
              and embedded system programming with JavaRT.
            </p>
            
            <div className="space-y-6">
              {iotExamples.map((example) => (
                <div key={example.id} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                      <p className="text-gray-400 text-sm">{example.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(example.code, example.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      {copiedCode === example.id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {copiedCode === example.id ? 'Copied!' : 'Copy Code'}
                      </span>
                    </button>
                  </div>
                  
                  <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-64 overflow-y-auto">
                    {example.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white mb-6">JavaRT Help & Documentation</h1>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HelpDocumentation;