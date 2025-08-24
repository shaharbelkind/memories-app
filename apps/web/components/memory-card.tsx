import Image from 'next/image';
import { Memory } from '@/lib/api';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const isVideo = memory.kind === 'video';
  const isAudio = memory.kind === 'audio';

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-100"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        {isVideo ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <p className="text-blue-600 font-medium">Video Memory</p>
            </div>
          </div>
        ) : isAudio ? (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">Audio Memory</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={memory.previewUrl || memory.url}
              alt="Memory"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        {/* Memory type badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium text-white
            ${memory.kind === 'photo' ? 'bg-blue-500' : ''}
            ${memory.kind === 'video' ? 'bg-purple-500' : ''}
            ${memory.kind === 'audio' ? 'bg-green-500' : ''}
            ${memory.kind === 'doc' ? 'bg-orange-500' : ''}
            ${memory.kind === 'scan3d' ? 'bg-pink-500' : ''}
          `}>
            {memory.kind.charAt(0).toUpperCase() + memory.kind.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            {new Date(memory.takenAt || memory.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-400">
              {new Date(memory.takenAt || memory.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        
        {memory.transcript && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            "{memory.transcript}"
          </p>
        )}
        
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{memory.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
