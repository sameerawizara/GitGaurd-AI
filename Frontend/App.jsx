import React, { useState, useEffect } from 'react';
import { fetchRepos, fetchHistory, updateRepoSettings } from './api';
import RepoCard from './components/RepoCard';
import ReviewTable from './components/ReviewTable';

export default function App() {
  const [repos, setRepos] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchRepos().then(setRepos);
    fetchHistory().then(setHistory);
  }, []);

  const handleToggle = async (id, field, value) => {
    const updated = await updateRepoSettings(id, { [field]: value });
    setRepos(repos.map(r => r.repoId === id ? updated : r));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Zaalima AI Reviewer</h1>
        <p className="text-slate-500 mt-2">Internal Dashboard • Gemini 1.5 Flash Enabled</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 px-1">Active Repositories</h2>
          {repos.map(repo => (
            <RepoCard key={repo.repoId} repo={repo} onToggle={handleToggle} />
          ))}
        </div>

        {/* History Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 px-1">Review Audit Log</h2>
          <ReviewTable logs={history} />
        </div>
      </div>
    </div>
  );
}