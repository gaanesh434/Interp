import React, { useState, useEffect, useRef } from 'react';
import { AutoCompleter, CompletionSuggestion } from '../../interpreter/core/AutoCompleter';

interface AutoCompleteWidgetProps {
  code: string;
  cursorPosition: number;
  onSelect: (suggestion: CompletionSuggestion) => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const AutoCompleteWidget: React.FC<AutoCompleteWidgetProps> = ({
  code,
  cursorPosition,
  onSelect,
  isVisible,
  onVisibilityChange
}) => {
  const [suggestions, setSuggestions] = useState<CompletionSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const autoCompleter = useRef(new AutoCompleter());
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const newSuggestions = autoCompleter.current.getSuggestions(code, cursorPosition);
      setSuggestions(newSuggestions);
      setSelectedIndex(0);
      
      if (newSuggestions.length === 0) {
        onVisibilityChange(false);
      }
    }
  }, [code, cursorPosition, isVisible, onVisibilityChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
            onVisibilityChange(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onVisibilityChange(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSelect, onVisibilityChange]);

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'annotation': return '📝';
      case 'method': return '⚡';
      case 'variable': return '📊';
      case 'keyword': return '🔑';
      case 'class': return '📦';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'annotation': return 'text-purple-400 bg-purple-900/20';
      case 'method': return 'text-blue-400 bg-blue-900/20';
      case 'variable': return 'text-yellow-400 bg-yellow-900/20';
      case 'keyword': return 'text-green-400 bg-green-900/20';
      case 'class': return 'text-cyan-400 bg-cyan-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={widgetRef}
      className="absolute z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-w-md min-w-80"
      style={{ 
        left: position.x, 
        top: position.y,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <div className="p-2 border-b border-gray-700 bg-gray-750">
        <div className="text-xs text-gray-400 font-medium">
          Code Completion ({suggestions.length} suggestions)
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors ${
              index === selectedIndex 
                ? 'bg-blue-600/20 border-blue-500/30' 
                : 'hover:bg-gray-700/50'
            }`}
            onClick={() => {
              onSelect(suggestion);
              onVisibilityChange(false);
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-sm text-white font-medium">
                    {suggestion.text}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 leading-relaxed">
                  {suggestion.description}
                </div>
                
                {suggestion.insertText !== suggestion.text && (
                  <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono text-gray-300">
                    {suggestion.insertText}
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 text-xs text-gray-500">
                {index === selectedIndex && (
                  <div className="flex items-center space-x-1">
                    <span>↵</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-700 bg-gray-750">
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Use ↑↓ to navigate, Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};