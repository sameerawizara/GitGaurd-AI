const API_BASE = '/api';

export const fetchRepos = () => fetch(`${API_BASE}/repos`).then(res => res.json());
export const fetchHistory = () => fetch(`${API_BASE}/history`).then(res => res.json());

export const updateRepoSettings = (repoId, settings) => 
  fetch(`${API_BASE}/repos/${repoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  }).then(res => res.json());