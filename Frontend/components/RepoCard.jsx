import React from 'react';
import { Shield, Zap } from 'lucide-react';

export default function RepoCard({ repo, onToggle }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="font-bold text-slate-800">{repo.fullName}</h3>
        <p className="text-xs text-slate-400">ID: {repo.repoId}</p>
      </div>
      
      <div className="flex gap-3">
        {/* Strict Mode Toggle */}
        <button 
          onClick={() => onToggle(repo.repoId, 'strictMode', !repo.strictMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            repo.strictMode ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Shield size={14} /> Strict
        </button>

        {/* Ignore Style Toggle */}
        <button 
          onClick={() => onToggle(repo.repoId, 'ignoreStyling', !repo.ignoreStyling)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            repo.ignoreStyling ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Zap size={14} /> Ignore Style
        </button>
      </div>
    </div>
  );
}