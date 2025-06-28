import React, { useRef, useEffect } from 'react';
import { JavaLexer, TokenType } from '../../interpreter/core/JavaLexer';
import { SyntaxValidator } from '../../interpreter/core/SyntaxValidator';

interface SyntaxHighlighterProps {
  code: string;
  onChange: (code: string) => void;
  errors: Array<{ line: number; message: string; type: 'error' | 'warning' }>;
  onErrorsChange?: (errors: Array<{ line: number; message: string; type: 'error' | 'warning' }>) => void;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ 
  code, 
  onChange, 
  errors,
  onErrorsChange 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Helper functions defined within the component scope
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const getTokenClassName = (tokenType: string): string => {
    switch (tokenType) {
      // Keywords
      case TokenType.CLASS:
      case TokenType.PUBLIC:
      case TokenType.PRIVATE:
      case TokenType.STATIC:
      case TokenType.VOID:
      case TokenType.INT:
      case TokenType.DOUBLE:
      case TokenType.BOOLEAN_TYPE:
      case TokenType.STRING_TYPE:
      case TokenType.IF:
      case TokenType.ELSE:
      case TokenType.WHILE:
      case TokenType.FOR:
      case TokenType.RETURN:
      case TokenType.NEW:
      case TokenType.THIS:
      case TokenType.TRUE:
      case TokenType.FALSE:
      case TokenType.NULL:
        return 'text-blue-400 font-semibold';
      
      // IoT Annotations
      case TokenType.DEADLINE:
      case TokenType.SENSOR:
      case TokenType.SAFETY_CHECK:
      case TokenType.REAL_TIME:
        return 'text-purple-400 font-semibold';
      
      // Strings
      case TokenType.STRING:
        return 'text-green-400';
      
      // Numbers
      case TokenType.NUMBER:
        return 'text-yellow-400';
      
      // Comments
      case TokenType.COMMENT:
        return 'text-gray-500 italic';
      
      // Operators
      case TokenType.PLUS:
      case TokenType.MINUS:
      case TokenType.MULTIPLY:
      case TokenType.DIVIDE:
      case TokenType.ASSIGN:
      case TokenType.EQUALS:
      case TokenType.NOT_EQUALS:
      case TokenType.LESS_THAN:
      case TokenType.GREATER_THAN:
        return 'text-red-400';
      
      // Method calls (identifiers followed by parentheses)
      case TokenType.IDENTIFIER:
        return 'text-cyan-400';
      
      default:
        return 'text-gray-100';
    }
  };

  const fallbackHighlighting = (text: string): string => {
    let highlighted = escapeHtml(text);
    
    // Java keywords
    highlighted = highlighted.replace(/\b(class|public|private|static|void|int|double|String|boolean|if|else|while|for|return|new|this|true|false|null)\b/g, 
      '<span class="text-blue-400 font-semibold">$1</span>');
    
    // IoT-specific annotations
    highlighted = highlighted.replace(/(@Deadline|@Sensor|@SafetyCheck|@RealTime)/g, 
      '<span class="text-purple-400 font-semibold">$1</span>');
    
    // String literals
    highlighted = highlighted.replace(/"([^"\\]|\\.)*"/g, 
      '<span class="text-green-400">$&</span>');
    
    // Numbers
    highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, 
      '<span class="text-yellow-400">$&</span>');
    
    // Comments
    highlighted = highlighted.replace(/\/\/.*$/gm, 
      '<span class="text-gray-500 italic">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, 
      '<span class="text-gray-500 italic">$&</span>');
    
    // Method calls
    highlighted = highlighted.replace(/(\w+)\s*\(/g, 
      '<span class="text-cyan-400">$1</span>(');
    
    // Operators
    highlighted = highlighted.replace(/([+\-*/%=<>!&|]+)/g, 
      '<span class="text-red-400">$1</span>');
    
    return highlighted;
  };

  // Real-time syntax validation
  useEffect(() => {
    const validateSyntax = () => {
      try {
        const lexer = new JavaLexer(code);
        const tokens = lexer.tokenize();
        const validator = new SyntaxValidator(tokens);
        const syntaxErrors = validator.validate();
        
        const formattedErrors = syntaxErrors.map(error => ({
          line: error.line,
          message: error.message,
          type: error.type
        }));
        
        if (onErrorsChange) {
          onErrorsChange(formattedErrors);
        }
      } catch (error) {
        console.warn('Syntax validation error:', error);
      }
    };

    const debounceTimer = setTimeout(validateSyntax, 300);
    return () => clearTimeout(debounceTimer);
  }, [code, onErrorsChange]);

  const highlightSyntax = (text: string): string => {
    try {
      const lexer = new JavaLexer(text);
      const tokens = lexer.tokenize();
      
      let highlightedCode = '';
      let lastIndex = 0;
      
      for (const token of tokens) {
        if (token.type === TokenType.EOF) break;
        
        // Add any text between tokens
        if (token.startIndex > lastIndex) {
          const betweenText = text.substring(lastIndex, token.startIndex);
          highlightedCode += escapeHtml(betweenText);
        }
        
        // Add highlighted token
        const className = getTokenClassName(token.type);
        const tokenValue = token.type === TokenType.STRING ? `"${token.value}"` : token.value;
        highlightedCode += `<span class="${className}">${escapeHtml(tokenValue)}</span>`;
        
        lastIndex = token.endIndex;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex);
        highlightedCode += escapeHtml(remainingText);
      }
      
      return highlightedCode;
    } catch (error) {
      // Fallback to simple highlighting
      return fallbackHighlighting(text);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumberWidth = Math.max(48, Math.log10(lineCount) * 8 + 32);

  return (
    <div className="relative h-full">
      {/* Line numbers with dynamic width */}
      <div 
        className="absolute left-0 top-0 bg-gray-900 h-full border-r border-gray-600 flex flex-col text-xs text-gray-500 z-30 overflow-hidden"
        style={{ width: `${lineNumberWidth}px` }}
      >
        {code.split('\n').map((_, index) => {
          const lineNumber = index + 1;
          const hasError = errors.some(error => error.line === lineNumber);
          return (
            <div 
              key={index} 
              className={`h-6 flex items-center justify-center flex-shrink-0 ${hasError ? 'bg-red-900/30 text-red-400' : ''}`}
              style={{ minHeight: '24px' }}
            >
              {lineNumber}
            </div>
          );
        })}
      </div>

      {/* Code input textarea */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="w-full h-full bg-transparent text-transparent caret-white font-mono text-sm p-4 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none relative z-20"
        style={{ 
          caretColor: 'white',
          paddingLeft: `${lineNumberWidth + 16}px`,
          lineHeight: '24px'
        }}
        spellCheck={false}
        placeholder="Enter your Java code with @Deadline annotations..."
      />
      
      {/* Syntax highlighted overlay */}
      <div 
        ref={highlightRef}
        className="absolute top-4 bottom-4 right-4 pointer-events-none font-mono text-sm whitespace-pre-wrap overflow-hidden z-10"
        style={{ 
          left: `${lineNumberWidth + 16}px`,
          lineHeight: '24px'
        }}
        dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
      />
      
      {/* Error indicators on the right side */}
      {errors.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-col space-y-1 z-40">
          {errors.slice(0, 10).map((error, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${error.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}
              title={`Line ${error.line}: ${error.message}`}
            />
          ))}
          {errors.length > 10 && (
            <div className="text-xs text-gray-400 text-center">
              +{errors.length - 10} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};