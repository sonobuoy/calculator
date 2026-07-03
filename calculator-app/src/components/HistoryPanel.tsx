import React from 'react';

interface HistoryPanelProps {
  history: string[];
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div 
      className="w-full bg-gray-800 rounded-lg p-4 mt-4"
      role="region"
      aria-label="Calculation history"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">History</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
          aria-label="Clear history"
          type="button"
        >
          Clear
        </button>
      </div>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {history.slice().reverse().map((item, index) => (
          <div 
            key={index} 
            className="text-xs text-gray-500 font-mono truncate"
            title={item}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
