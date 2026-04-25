import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReviewTable({ logs }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
          <tr>
            <th className="px-6 py-4">PR #</th>
            <th className="px-6 py-4">Repository</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-mono text-indigo-600">#{log.prNumber}</td>
              <td className="px-6 py-4 text-slate-700">{log.repoName}</td>
              <td className="px-6 py-4">
                {log.vulnerabilityScore > 7 ? (
                  <span className="flex items-center gap-1 text-red-600"><AlertCircle size={14}/> Critical</span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14}/> Clean</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}