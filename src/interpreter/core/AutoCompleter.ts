import { Token, TokenType } from './JavaLexer';

export interface CompletionSuggestion {
  text: string;
  type: 'keyword' | 'annotation' | 'method' | 'variable' | 'class';
  description: string;
  insertText: string;
  priority: number;
}

export class AutoCompleter {
  private iotSuggestions: CompletionSuggestion[] = [
    // IoT Annotations
    {
      text: '@Deadline',
      type: 'annotation',
      description: 'Real-time deadline constraint for IoT operations',
      insertText: '@Deadline(ms=${1:5})',
      priority: 10
    },
    {
      text: '@Sensor',
      type: 'annotation',
      description: 'Sensor data annotation with type specification',
      insertText: '@Sensor(type="${1:temperature}")',
      priority: 9
    },
    {
      text: '@SafetyCheck',
      type: 'annotation',
      description: 'Enable safety verification for critical operations',
      insertText: '@SafetyCheck',
      priority: 8
    },
    {
      text: '@RealTime',
      type: 'annotation',
      description: 'Mark method as real-time critical',
      insertText: '@RealTime',
      priority: 8
    },

    // IoT Methods
    {
      text: 'sensorRead',
      type: 'method',
      description: 'Read sensor data with deadline enforcement',
      insertText: 'sensorRead()',
      priority: 7
    },
    {
      text: 'dataTransmit',
      type: 'method',
      description: 'Transmit data with timing constraints',
      insertText: 'dataTransmit(${1:data})',
      priority: 7
    },
    {
      text: 'processData',
      type: 'method',
      description: 'Process sensor data with safety checks',
      insertText: 'processData(${1:input})',
      priority: 6
    },

    // Common Java constructs
    {
      text: 'System.out.println',
      type: 'method',
      description: 'Print output to console',
      insertText: 'System.out.println(${1:"message"})',
      priority: 5
    },
    {
      text: 'Math.random',
      type: 'method',
      description: 'Generate random number between 0 and 1',
      insertText: 'Math.random()',
      priority: 4
    },
    {
      text: 'Math.floor',
      type: 'method',
      description: 'Round down to nearest integer',
      insertText: 'Math.floor(${1:value})',
      priority: 4
    },

    // Variable types
    {
      text: 'int temperature',
      type: 'variable',
      description: 'Temperature sensor variable',
      insertText: 'int temperature = ${1:25}',
      priority: 6
    },
    {
      text: 'int humidity',
      type: 'variable',
      description: 'Humidity sensor variable',
      insertText: 'int humidity = ${1:60}',
      priority: 6
    },
    {
      text: 'boolean isActive',
      type: 'variable',
      description: 'System active status',
      insertText: 'boolean isActive = ${1:true}',
      priority: 5
    },
    {
      text: 'String message',
      type: 'variable',
      description: 'Message string variable',
      insertText: 'String message = ${1:""}',
      priority: 5
    },

    // Control structures
    {
      text: 'if',
      type: 'keyword',
      description: 'Conditional statement',
      insertText: 'if (${1:condition}) {\n    ${2:// code}\n}',
      priority: 3
    },
    {
      text: 'for',
      type: 'keyword',
      description: 'For loop',
      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3:// code}\n}',
      priority: 3
    },
    {
      text: 'while',
      type: 'keyword',
      description: 'While loop',
      insertText: 'while (${1:condition}) {\n    ${2:// code}\n}',
      priority: 3
    }
  ];

  getSuggestions(code: string, cursorPosition: number): CompletionSuggestion[] {
    const currentWord = this.getCurrentWord(code, cursorPosition);
    const context = this.getContext(code, cursorPosition);
    
    if (currentWord.length === 0) {
      return [];
    }

    // Filter suggestions based on current word
    let suggestions = this.iotSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(currentWord.toLowerCase()) ||
      suggestion.insertText.toLowerCase().includes(currentWord.toLowerCase())
    );

    // Context-aware filtering
    if (context.isAnnotationContext) {
      suggestions = suggestions.filter(s => s.type === 'annotation');
    } else if (context.isMethodContext) {
      suggestions = suggestions.filter(s => s.type === 'method' || s.type === 'keyword');
    } else if (context.isVariableContext) {
      suggestions = suggestions.filter(s => s.type === 'variable' || s.type === 'keyword');
    }

    // Sort by priority and relevance
    suggestions.sort((a, b) => {
      const aRelevance = this.calculateRelevance(a, currentWord);
      const bRelevance = this.calculateRelevance(b, currentWord);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      return b.priority - a.priority;
    });

    return suggestions.slice(0, 10); // Limit to top 10 suggestions
  }

  private getCurrentWord(code: string, position: number): string {
    const beforeCursor = code.substring(0, position);
    const match = beforeCursor.match(/[@\w]*$/);
    return match ? match[0] : '';
  }

  private getContext(code: string, position: number): {
    isAnnotationContext: boolean;
    isMethodContext: boolean;
    isVariableContext: boolean;
  } {
    const beforeCursor = code.substring(0, position);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const previousLine = lines.length > 1 ? lines[lines.length - 2] : '';

    return {
      isAnnotationContext: currentLine.trim().startsWith('@') || beforeCursor.endsWith('@'),
      isMethodContext: currentLine.includes('(') || previousLine.includes('@'),
      isVariableContext: /\b(int|double|String|boolean)\s*$/.test(currentLine)
    };
  }

  private calculateRelevance(suggestion: CompletionSuggestion, currentWord: string): number {
    const text = suggestion.text.toLowerCase();
    const word = currentWord.toLowerCase();
    
    if (text.startsWith(word)) {
      return 100;
    } else if (text.includes(word)) {
      return 50;
    } else if (suggestion.insertText.toLowerCase().includes(word)) {
      return 25;
    }
    
    return 0;
  }
}