import React, { useState } from 'react';
import { ScanHistoryItem, DetectionVerdict } from '../types';
import { Trash2, Search, Filter, Calendar } from 'lucide-react';

interface HistoryProps {
  history: ScanHistoryItem[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'AI' | 'HUMAN'>('ALL');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'ALL' ? true :
      filter === 'AI' ? item.verdict === DetectionVerdict.AI :
      item.verdict === DetectionVerdict.HUMAN;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analysis History</h1>
          <p className="text-gray-400">Previous scans stored locally on this device.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onClear}
            className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Clear History
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by filename..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50 text-white cursor-pointer"
          >
            <option value="ALL">All Verdicts</option>
            <option value="AI">AI Generated</option>
            <option value="HUMAN">Human Made</option>
          </select>
        </div>
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
          <p>No history found. Start analyzing images to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="glass-card p-4 rounded-xl flex items-center gap-6 hover:bg-white/10 transition-colors group">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black/50 border border-white/10">
                <img src={item.thumbnail} alt={item.fileName} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold truncate text-white">{item.fileName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    item.verdict === DetectionVerdict.AI ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                    item.verdict === DetectionVerdict.HUMAN ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                    'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                  }`}>
                    {item.verdict}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{item.reasoning}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.timestamp).toLocaleDateString()}</span>
                  <span>Confidence: {item.confidence}%</span>
                  <span>Model: {item.modelUsed}</span>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-2xl font-bold text-gray-200">{item.aiProbability}%</div>
                <div className="text-xs text-gray-500">Probability</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;