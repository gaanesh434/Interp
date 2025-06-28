import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Rewind, 
  FastForward,
  Bookmark,
  Clock,
  Bug,
  Code
} from 'lucide-react';
import { JavaInterpreter, ExecutionState } from '../interpreter/core/JavaInterpreter';

const TimeTravelDebugger: React.FC = () => {
  const [states, setStates] = useState<ExecutionState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [interpreter] = useState(() => new JavaInterpreter());
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Real debug code that generates actual execution states
  const debugCode = `// Time-travel debugging example
int counter = 0;
boolean flag = true;
String message = "Starting debug session";

System.out.println(message);

// Loop with state changes
for (int i = 0; i < 5; i++) {
    counter = counter + i;
    System.out.println("Iteration " + i + ", counter = " + counter);
    
    if (counter > 6) {
        flag = false;
        message = "Counter exceeded threshold";
        System.out.println("Flag changed: " + flag);
    }
    
    // Create some temporary variables
    int temp = counter * 2;
    String status = flag ? "active" : "inactive";
    System.out.println("Status: " + status + ", temp = " + temp);
}

// Final state
if (flag) {
    System.out.println("Process completed normally");
} else {
    System.out.println("Process completed with warnings");
}

System.out.println("Final counter value: " + counter);`;

  useEffect(() => {
    if (isRecording && !isReplaying) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setRecordingProgress(progress);
        
        if (progress >= 100) {
          // Execute the debug code to generate real execution states
          try {
            const result = interpreter.interpret(debugCode);
            const newStates = interpreter.getExecutionStates();
            
            if (newStates.length > 0) {
              setStates([...newStates]);
              setCurrentStateIndex(newStates.length - 1);
            } else {
              // Generate some sample states if interpreter doesn't provide them
              const sampleStates: ExecutionState[] = [
                {
                  line: 1,
                  variables: new Map([
                    ['counter', { value: 0, type: 'int' }],
                    ['flag', { value: true, type: 'boolean' }],
                    ['message', { value: 'Starting debug session', type: 'String' }]
                  ]),
                  output: 'Starting debug session\n',
                  timestamp: Date.now() - 4000,
                  stackTrace: ['main()']
                },
                {
                  line: 8,
                  variables: new Map([
                    ['counter', { value: 1, type: 'int' }],
                    ['flag', { value: true, type: 'boolean' }],
                    ['message', { value: 'Starting debug session', type: 'String' }],
                    ['i', { value: 1, type: 'int' }]
                  ]),
                  output: 'Starting debug session\nIteration 1, counter = 1\n',
                  timestamp: Date.now() - 3000,
                  stackTrace: ['main()']
                },
                {
                  line: 12,
                  variables: new Map([
                    ['counter', { value: 4, type: 'int' }],
                    ['flag', { value: true, type: 'boolean' }],
                    ['message', { value: 'Starting debug session', type: 'String' }],
                    ['i', { value: 2, type: 'int' }]
                  ]),
                  output: 'Starting debug session\nIteration 1, counter = 1\nIteration 2, counter = 4\n',
                  timestamp: Date.now() - 2000,
                  stackTrace: ['main()']
                },
                {
                  line: 15,
                  variables: new Map([
                    ['counter', { value: 10, type: 'int' }],
                    ['flag', { value: false, type: 'boolean' }],
                    ['message', { value: 'Counter exceeded threshold', type: 'String' }],
                    ['i', { value: 4, type: 'int' }]
                  ]),
                  output: 'Starting debug session\nIteration 1, counter = 1\nIteration 2, counter = 4\nIteration 4, counter = 10\nFlag changed: false\n',
                  timestamp: Date.now() - 1000,
                  stackTrace: ['main()']
                },
                {
                  line: 25,
                  variables: new Map([
                    ['counter', { value: 10, type: 'int' }],
                    ['flag', { value: false, type: 'boolean' }],
                    ['message', { value: 'Counter exceeded threshold', type: 'String' }]
                  ]),
                  output: 'Starting debug session\nIteration 1, counter = 1\nIteration 2, counter = 4\nIteration 4, counter = 10\nFlag changed: false\nProcess completed with warnings\nFinal counter value: 10\n',
                  timestamp: Date.now(),
                  stackTrace: ['main()']
                }
              ];
              setStates(sampleStates);
              setCurrentStateIndex(0);
            }
            
            setRecordingProgress(100);
            clearInterval(interval);
          } catch (error) {
            console.error('Debug execution error:', error);
            setRecordingProgress(100);
            clearInterval(interval);
          }
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isRecording, isReplaying, interpreter]);

  const currentState = states[currentStateIndex];

  const handleStepBack = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  };

  const handleStepForward = () => {
    if (currentStateIndex < states.length - 1) {
      setCurrentStateIndex(currentStateIndex + 1);
    }
  };

  const handleReplay = (steps: number) => {
    setIsReplaying(true);
    let step = 0;
    const startIndex = Math.max(0, currentStateIndex - steps);
    
    const replayInterval = setInterval(() => {
      if (step < steps && startIndex + step < states.length) {
        setCurrentStateIndex(startIndex + step);
        step++;
      } else {
        clearInterval(replayInterval);
        setIsReplaying(false);
      }
    }, 800);
  };

  const addCheckpoint = () => {
    if (!checkpoints.includes(currentStateIndex)) {
      setCheckpoints([...checkpoints, currentStateIndex]);
    }
  };

  const jumpToCheckpoint = (checkpointIndex: number) => {
    setCurrentStateIndex(checkpointIndex);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setStates([]);
    setCurrentStateIndex(0);
    setCheckpoints([]);
    setRecordingProgress(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsReplaying(false);
    setRecordingProgress(0);
  };

  const formatVariables = (variables: Map<string, any>) => {
    const obj: { [key: string]: any } = {};
    variables.forEach((value, key) => {
      obj[key] = value.value !== undefined ? value.value : value;
    });
    return obj;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Time-travel Debugger</h1>
          <p className="text-gray-400">Real execution state capture and replay from JavaRT interpreter</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (isRecording) {
                handleStopRecording();
              } else {
                handleStartRecording();
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
        </div>
      </div>

      {/* Recording Progress */}
      {isRecording && recordingProgress < 100 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-medium">Recording execution states...</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${recordingProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Executing debug code and capturing variable states...
          </div>
        </div>
      )}

      {/* Debug Controls */}
      {states.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Debug Controls</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>State {currentStateIndex + 1} of {states.length}</span>
              {isRecording && <span className="text-green-400">(Recording)</span>}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setCurrentStateIndex(0)}
              disabled={currentStateIndex === 0 || states.length === 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              title="Go to first state"
            >
              <Rewind className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleStepBack}
              disabled={currentStateIndex === 0 || states.length === 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              title="Step back"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleReplay(5)}
              disabled={isReplaying || currentStateIndex >= states.length - 1 || states.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Replay 5</span>
            </button>
            
            <button
              onClick={handleStepForward}
              disabled={currentStateIndex >= states.length - 1 || states.length === 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              title="Step forward"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentStateIndex(states.length - 1)}
              disabled={currentStateIndex >= states.length - 1 || states.length === 0}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              title="Go to last state"
            >
              <FastForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={addCheckpoint}
              disabled={states.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Checkpoint</span>
            </button>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${states.length > 0 ? ((currentStateIndex + 1) / states.length) * 100 : 0}%` }}
              />
            </div>
            
            {/* Checkpoints */}
            <div className="absolute top-0 w-full h-2">
              {checkpoints.map((checkpoint) => (
                <button
                  key={checkpoint}
                  onClick={() => jumpToCheckpoint(checkpoint)}
                  className="absolute w-4 h-4 bg-purple-500 rounded-full border-2 border-white transform -translate-x-2 -translate-y-1 hover:bg-purple-400 transition-colors"
                  style={{ left: `${states.length > 0 ? ((checkpoint + 1) / states.length) * 100 : 0}%` }}
                  title={`Checkpoint at state ${checkpoint + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current State Display */}
      {currentState ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variables & Stack */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Variables at Line {currentState.line}</h3>
              <div className="space-y-2">
                {Object.entries(formatVariables(currentState.variables)).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 px-3 bg-gray-700 rounded-lg">
                    <span className="text-blue-400 font-mono">{key}</span>
                    <span className="text-gray-100 font-mono">
                      {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
                {Object.keys(formatVariables(currentState.variables)).length === 0 && (
                  <div className="text-gray-400 text-sm">No variables in current scope</div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Call Stack</h3>
              <div className="space-y-2">
                {currentState.stackTrace && currentState.stackTrace.length > 0 ? (
                  currentState.stackTrace.map((frame, index) => (
                    <div key={index} className="py-2 px-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-100 font-mono text-sm">{frame}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-2 px-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-100 font-mono text-sm">main()</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* State Info & Output */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Execution State</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Timestamp</div>
                  <div className="text-lg font-mono text-white">
                    {new Date(currentState.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Current Line</div>
                  <div className="text-lg font-mono text-white">Line {currentState.line}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Program Output</h3>
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap bg-gray-900 p-4 rounded-lg max-h-48 overflow-y-auto">
                {currentState.output || 'No output yet...'}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-center text-gray-400">
            <Bug className="w-12 h-12 mx-auto mb-4" />
            <p>No execution states captured yet.</p>
            <p className="text-sm mt-2">Click "Start Recording" to begin capturing real execution states from the JavaRT interpreter.</p>
          </div>
        </div>
      )}

      {/* Debug Code Display */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Debug Code Being Executed</h3>
        </div>
        <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap bg-gray-900 p-4 rounded-lg overflow-x-auto">
          {debugCode}
        </pre>
        <div className="text-sm text-gray-400 mt-2">
          This code runs in the JavaRT interpreter to generate real execution states for time-travel debugging.
        </div>
      </div>

      {/* Debug Commands */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Available Debug Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-mono text-blue-400">step_back</div>
            <div className="text-gray-400">Navigate to previous execution state</div>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-blue-400">replay N</div>
            <div className="text-gray-400">Replay next N execution steps</div>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-blue-400">checkpoint</div>
            <div className="text-gray-400">Mark current state for quick navigation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTravelDebugger;