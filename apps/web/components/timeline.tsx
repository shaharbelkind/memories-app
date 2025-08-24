'use client';

import { useState, useEffect } from 'react';
import { MemoryCard } from './memory-card';
import { SearchBar } from './search-bar';
import { api, Memory, MemoryConnection } from '@/lib/api';

interface TimelineProps {
  childId: string;
}

export function Timeline({ childId }: TimelineProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchResults, setSearchResults] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadMemories();
  }, [childId]);

  const loadMemories = async (after?: string) => {
    try {
      const data: MemoryConnection = await api.getMemories(childId, after);
      if (after) {
        setMemories(prev => [...prev, ...data.edges.map(edge => edge.node)]);
      } else {
        setMemories(data.edges.map(edge => edge.node));
      }
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && endCursor) {
      loadMemories(endCursor);
    }
  };

  const handleSearchResults = (results: Memory[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  const displayMemories = isSearching ? searchResults : memories;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your precious memories...</p>
        </div>
      </div>
    );
  }

  if (displayMemories.length === 0) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <SearchBar childId={childId} onResults={handleSearchResults} />
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isSearching ? 'No search results found' : 'No memories yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isSearching 
              ? 'Try searching with different keywords or browse all memories below.'
              : 'Start by uploading your first precious moment above!'
            }
          </p>
          {isSearching && (
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchResults([]);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to all memories
            </button>
          )}
          {!isSearching && (
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <SearchBar childId={childId} onResults={handleSearchResults} />

      {/* Memory count and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold text-gray-900">
            {displayMemories.length} Memory{displayMemories.length !== 1 ? 'ies' : ''}
            {isSearching && <span className="text-blue-600"> (search results)</span>}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {isSearching ? 'Search results' : 'Latest first'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isSearching && (
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchResults([]);
              }}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to all
            </button>
          )}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Memory grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayMemories.map((memory, index) => (
          <div
            key={memory.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MemoryCard
              memory={memory}
              onClick={() => console.log('Open memory:', memory.id)}
            />
          </div>
        ))}
      </div>
      
      {/* Load more button - only show for non-search results */}
      {hasNextPage && !isSearching && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Load More Memories
            <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
