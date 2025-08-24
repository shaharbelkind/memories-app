'use client';

import { Milestone } from '@/lib/api';

interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: () => void;
}

export function MilestoneCard({ milestone, onClick }: MilestoneCardProps) {
  const getMilestoneIcon = (kind: string) => {
    switch (kind) {
      case 'birthday':
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'first-step':
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 p-6"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {getMilestoneIcon(milestone.kind)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {milestone.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(milestone.confidence)}`}>
              {Math.round(milestone.confidence * 100)}% confident
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {new Date(milestone.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {milestone.linkedMemoryIds.length} memory{milestone.linkedMemoryIds.length !== 1 ? 'ies' : ''}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 capitalize">
              {milestone.kind.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
